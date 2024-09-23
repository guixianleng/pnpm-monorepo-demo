import { ElMessage, ElNotification } from "element-plus"

import type { Fn } from "#/types"
import { isFunction } from "../../is"

import { httpCodeMsg } from "../const/httpCode"
import type { ErrorMessageMode } from "../types/axios"

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = "message",
  // 未登录处理逻辑
  abnormalLoginFn: Fn
): void {
  let errMessage = ""

  switch (status) {
    case 400:
      errMessage = `${msg}`
      break
    // 401: 未登录
    case 401:
      errMessage = msg || httpCodeMsg.errMsg401
      if (isFunction(abnormalLoginFn)) {
        abnormalLoginFn()
      }
      break
    case 403:
      errMessage = httpCodeMsg.errMsg403
      break
    // 404请求不存在
    case 404:
      errMessage = httpCodeMsg.errMsg404
      break
    case 405:
      errMessage = httpCodeMsg.errMsg405
      break
    case 408:
      errMessage = httpCodeMsg.errMsg408
      break
    case 500:
      errMessage = httpCodeMsg.errMsg500
      break
    case 501:
      errMessage = httpCodeMsg.errMsg501
      break
    case 502:
      errMessage = httpCodeMsg.errMsg502
      break
    case 503:
      errMessage = httpCodeMsg.errMsg503
      break
    case 504:
      errMessage = httpCodeMsg.errMsg504
      break
    case 505:
      errMessage = httpCodeMsg.errMsg505
      break
    default:
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
  }
}
