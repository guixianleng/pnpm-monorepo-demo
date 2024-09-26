export interface TenantVO extends BaseEntity {
  tenantId: number | string
  tenantName: string
  tenantCompany: string
  userName: string
  password: string
  accountCount: number
  expireTime: string
  userRemark: string
  tenantStatus: number
}

export interface TenantQuery extends PageQuery {
  tenantName: string
  tenantCompany: string
}

export interface TenantForm {
  tenantId: number | string | undefined
  menuIds: string[]
  datasource: {
    dsType: string
    dsName: string
    dsHost: string
    dsPort: string
    dsUser: string
    dsPwd: string
    dsDatabase: string
    dsParsms: string
    userRemark: string
  }
  tenantName: string
  tenantCompany: string
  userName: string
  password: string
  accountCount: number
  expireTime: string
  userRemark: string
}
