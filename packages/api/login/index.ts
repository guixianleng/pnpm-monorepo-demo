import { Http } from "@user-admin/api"
import type { UserInfo } from "@user-admin/types"
import { AxiosPromise } from "axios"
import { LoginData, LoginResult } from "./types"

// pc端固定客户端授权id
const clientId = import.meta.env.VITE_APP_CLIENT_ID

/**
 * @param data {LoginData}
 * @returns
 */
export async function login(data: LoginData): AxiosPromise<LoginResult> {
  const params = {
    ...data,
    clientId: data.clientId || clientId
  }
  return Http.request({
    url: "/auth/login",
    headers: {
      isToken: false,
      isEncrypt: false,
      repeatSubmit: false
    },
    method: "post",
    data: params
  })
}

/**
 * 注销
 */
export function logout() {
  return Http.request({
    url: "/auth/logout",
    method: "post"
  })
}

// 获取用户详细信息
export function getInfo(): AxiosPromise<UserInfo> {
  return Http.request({
    url: "/auth/user/info",
    method: "post"
  })
}
