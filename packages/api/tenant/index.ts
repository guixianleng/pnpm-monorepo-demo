import { Http } from "@user-admin/api"
import { TenantForm, TenantQuery, TenantVO } from "./types"
import { AxiosPromise } from "axios"

// 查询租户列表
export function listTenant(query: TenantQuery): AxiosPromise<TenantVO[]> {
  return Http.request({
    url: "/tenant/SysTenant/page",
    method: "post",
    data: query
  })
}

// 查询租户详细
export function getTenant(id: string | number): AxiosPromise<TenantVO> {
  return Http.request({
    url: "/tenant/SysTenant/detail/" + id,
    method: "get"
  })
}

// 新增租户
export function addTenant(data: TenantForm) {
  return Http.request({
    url: "/tenant/SysTenant/save",
    method: "post",
    data
  })
}

// 修改租户
export function updateTenant(data: TenantForm) {
  return Http.request({
    url: "/tenant/SysTenant/modify",
    method: "put",
    data
  })
}

// 租户状态修改
export function changeTenantStatus(data: { tenantId: string | number; tenantStatus: string }) {
  return Http.request({
    url: "/tenant/SysTenant/updateStatus",
    method: "post",
    data
  })
}

// 删除租户
export function delTenant(id: string | number | Array<string | number>) {
  return Http.request({
    url: "/tenant/SysTenant/remove/" + id,
    method: "delete"
  })
}

// 动态切换租户
export function dynamicTenant(tenantId: string | number) {
  return Http.request({
    url: "/system/tenant/dynamic/" + tenantId,
    method: "get"
  })
}

// 获取国密加密密钥
export function gerDecodeSrcret() {
  return Http.request({
    url: "/tenant/SysTenant/getDecodeKey",
    method: "get"
  })
}
