// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
import type { AxiosInstance, AxiosResponse } from "axios"
import axios from "axios"
import { ElMessage, ElNotification } from "element-plus"
import { clone, isUndefined } from "lodash-es"

import { ContentTypeEnum, RequestEnum, ResultEnum } from "../../../enums/httpEnum"
import type { Recordable } from "#/types"
import { deepMerge, setObjToUrlParams } from "../../index"
import { AxiosRetry } from "./axiosRetry"
import { isEmpty, isFunction, isNull, isString } from "../../is"

import { httpCodeMsg } from "../const/httpCode"
import type { RequestOptions, Result } from "../types/axios"
import { VAxios } from "./Axios"
import type { AxiosTransform, CreateAxiosOptions } from "./axiosTransform"
import { checkStatus } from "./checkStatus"
import { formatRequestDate, joinTimestamp } from "./helper"

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformResponse, isReturnNativeResponse } = options
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data
    }
    // 错误的时候返回

    const { data } = res
    if (!data) {
      throw new Error(httpCodeMsg.apiRequestFailed)
    }
    //  这里 code，result，msg为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, msg } = data

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && Reflect.has(data, "code") && code === ResultEnum.SUCCESS

    if (hasSuccess) {
      let successMsg = msg

      if (isNull(successMsg) || isUndefined(successMsg) || isEmpty(successMsg)) {
        successMsg = httpCodeMsg.operationSuccess
      }

      if (options.successMessageMode === "modal") {
        ElNotification({
          title: httpCodeMsg.successTip,
          message: successMsg,
          type: "success"
        })
      } else if (options.successMessageMode === "message") {
        ElMessage.success(successMsg)
      }

      // 二进制数据则直接返回
      if (res.request.responseType === "blob" || res.request.responseType === "arraybuffer") {
        return data
      }

      return res.data
    }

    // console.log(hasSuccess, code, msg, '查看')

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = msg
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = httpCodeMsg.timeoutMessage
        // 被动登出，带redirect地址
        if (options.abnormalLoginFn && isFunction(options.abnormalLoginFn)) {
          options.abnormalLoginFn()
        }
        break
      case "A0220":
        if (options.abnormalLoginFn && isFunction(options.abnormalLoginFn)) {
          options.abnormalLoginFn()
        }
        break
      default:
        break
    }

    // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (options.errorMessageMode === "modal") {
      ElNotification({
        title: httpCodeMsg.errorTip,
        message: timeoutMsg,
        type: "error"
      })
    } else if (options.errorMessageMode === "message") {
      ElMessage.error(timeoutMsg)
    }

    throw new Error(timeoutMsg || httpCodeMsg.apiRequestFailed)
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }
    const params = config.params || {}
    const data = config.data || false
    formatDate && data && !isString(data) && formatRequestDate(data)
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (
          Reflect.has(config, "data") &&
          config.data &&
          (Object.keys(config.data).length > 0 || config.data instanceof FormData)
        ) {
          config.data = data
          config.params = params
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          )
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    let token: string = ""
    if (options?.getToken && isFunction(options.getToken)) {
      token = options.getToken()
    }
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      const authKey = options?.tokenName || "Authorization"
      // jwt token
      ;(config as Recordable).headers[authKey] = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token
    }
    return config
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    const { response, code, message, config } = error || {}
    const errorMessageMode = config?.requestOptions?.errorMessageMode || "none"
    const msg: string = response?.data?.error?.message ?? ""
    const err: string = error?.toString?.() ?? ""
    let errMessage = ""

    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    try {
      // 请求超时处理
      if (code === "ECONNABORTED" && message.indexOf("timeout") !== -1) {
        errMessage = httpCodeMsg.apiTimeoutMessage
      }
      // 网络错误处理
      if (err?.includes("Network Error")) {
        errMessage = httpCodeMsg.networkExceptionMsg
      }

      if (errMessage) {
        if (errorMessageMode === "modal") {
          ElNotification({
            title: httpCodeMsg.errorTip,
            message: errMessage,
            type: "error"
          })
        } else if (errorMessageMode === "message") {
          ElMessage.error(errMessage)
        }
        return Promise.reject(error)
      }
    } catch (error) {
      throw new Error(error as unknown as string)
    }

    checkStatus(
      error?.response?.status,
      msg,
      errorMessageMode,
      config?.requestOptions?.abnormalLoginFn
    )

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry()
    const { isOpenRetry } = config.requestOptions.retryRequest
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      error?.response?.status !== 401 &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      retryRequest.retry(axiosInstance, error)
    return Promise.reject(error)
  }
}

export function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // 深度合并
    deepMerge(
      {
        // authenticationScheme: 'Bearer',
        authenticationScheme: "",
        tokenName: "Authorization",
        timeout: 20 * 1000,

        headers: { "Content-Type": ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: "message",
          // 是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            isOpenRetry: true,
            count: 5,
            waitTime: 100
          },
          // 接口地址
          apiUrl: "/basic-api",
          // 接口拼接地址
          urlPrefix: "",
          abnormalLoginFn: null
        },
        getToken: null
      },
      opt || {}
    )
  )
}
