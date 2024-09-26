// 参数接口
enum CLIENT_ENUM {
  MOBILE = 0,
  PC = 1
}

export interface ILoginLogParams {
  /*关键字搜索 */
  searchValue?: string

  /*当前页数 */
  pageNum?: number

  /*每页记录数） */
  pageSize?: number

  /*排序字段 */
  sortColumn?: keyof LoginLogRecord

  /*排序方式 */
  sortType?: string

  /*其它参数（主要用于时间区间查询） */
  params?: Record<string, any>

  /*访问ID */
  infoId?: number

  /*租户ID */
  tenantId?: number

  /*用户名称 */
  userName?: string

  /*登录IP地址 */
  ipAddr?: string
  loginName?: string
  /*登录状态（0成功 1失败） */
  infoStatus?: string

  /*提示信息 */
  infoMsg?: string
  userPhone?: string
  /*浏览器类型 */
  browser?: string
  isMobile?: CLIENT_ENUM
  /*操作系统 */
  loginOs?: string

  /*访问时间 */
  accessTime?: ""
}

// 响应接口
/**
 * ILoginLogRes
 */
export interface LoginLogRecord {
  accessTime: string
  browser: string
  createBy: null
  infoId: number
  infoMsg: string
  infoStatus: string
  ipAddr: string
  loginOs: string
  tenantId: number
  userName: string
  [property: string]: any
}
export interface ILoginLogData {
  current: number
  pages: number
  records: LoginLogRecord[]
  size: number
  total: number
  [property: string]: any
}
// 参数接口
export interface IOperaParams {
  /*关键字搜索 */
  searchValue?: string

  /*当前页数 */
  pageNum?: number

  /*每页记录数） */
  pageSize?: number

  /*排序字段 */
  sortColumn?: string

  /*排序方式 */
  sortType?: string

  /*其它参数（主要用于时间区间查询） */
  params?: Record<string, unknown>

  /*日志主键 */
  operId?: number

  /*租户ID */
  tenantId?: number

  /*模块标题 */
  title?: string
  module?: string
  /*业务类型（0其它 1新增 2修改 3删除） */
  businessType?: number

  /*方法名称 */
  method?: string

  /*请求方式 */
  requestMethod?: string

  /*操作类别（0其它 1 PC用户 2 手机端用户） */
  operatorType?: number

  /*操作人员ID */
  operUser?: number

  /*操作人员 */
  operName?: string

  /*部门名称 */
  deptName?: string

  /*请求URL */
  operUrl?: string

  /*主机地址 */
  operIp?: string

  /*请求参数 */
  operParam?: string

  /*返回参数 */
  jsonResult?: string

  /*操作状态（0正常 1异常） */
  status?: number

  /*错误消息 */
  errorMsg?: string

  /*操作时间 */
  operTime?: Record<string, unknown>

  /*消耗时间 */
  costTime?: number
}

export interface IOperaRecord {
  businessType: number
  costTime: number
  deptName: string
  errorMsg: string
  jsonResult: string
  method: string
  module: string
  operatorType: number
  operId: number
  operIp: string
  operName: string
  operParam: string
  operTime: null
  operUrl: string
  operUser: number
  requestMethod: string
  status: number
  tenantId: number
  title: string
  [property: string]: any
}
export interface IOperaRes {
  current: number
  pages: number
  records: IOperaRecord[]
  size: number
  total: number
  [property: string]: any
}
