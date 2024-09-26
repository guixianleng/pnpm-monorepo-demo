import { Http } from "@user-admin/api"
import type { ILoginLogData, ILoginLogParams, IOperaParams, IOperaRes } from "./types"

// 请求登录日志
export const getLoginList = (params: ILoginLogParams): Promise<ILoginLogData> => {
  return Http.request({
    url: "/admin/logininfo/page",
    data: params,
    method: "post"
  })
}
export const getOperaList = (data: IOperaParams): Promise<IOperaRes> => {
  return Http.request({
    url: "/log/oper-log/page",
    method: "post",
    data
  })
}
