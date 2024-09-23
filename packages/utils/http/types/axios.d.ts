import type { Fn } from "#/types"

export type ErrorMessageMode = "none" | "modal" | "message" | undefined
export type SuccessMessageMode = ErrorMessageMode

export interface RequestOptions {
  // 是否将prefix 添加到url
  joinParamsToUrl?: boolean
  // 格式化时间参数
  formatDate?: boolean
  // 是否处理请求结果
  isTransformResponse?: boolean
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse?: boolean
  // post请求的时候添加参数到url
  joinPrefix?: boolean
  // 错误信息提示类型
  errorMessageMode?: ErrorMessageMode
  // 成功消息提示类型
  successMessageMode?: SuccessMessageMode
  // 是否添加时间戳
  joinTime?: boolean
  ignoreCancelToken?: boolean
  // 是否在请求头中发送令牌
  withToken?: boolean
  // 请求重试机制
  retryRequest?: RetryRequest
  // 接口地址
  apiUrl?: string
  // 请求拼接路径
  urlPrefix?: string
  // 登录异常逻辑处理
  abnormalLoginFn?: Fn
}

export interface RetryRequest {
  isOpenRetry: boolean
  count: number
  waitTime: number
}

// 接口返回的数据结构
export interface Result<T = any> {
  code: number | string
  success: boolean
  msg: string
  data: T
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Recordable
  // File parameter interface field name
  name?: string
  // file name
  file: File | Blob
  // file name
  filename?: string
  [key: string]: any
}
