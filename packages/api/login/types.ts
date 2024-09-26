/**
 * 登录请求
 */
export interface LoginData {
  tenantId?: string
  loginName?: string
  password?: string
  rememberMe?: boolean
  socialCode?: string
  socialState?: string
  source?: string
  code?: string
  uuid?: string
  clientId: string
}

/**
 * 登录响应
 */
export interface LoginResult {
  access_token: string
  [key: string]: any
}
