import type { UserVO, UserQuery } from "@user-admin/types"
import { AxiosPromise } from "axios"
import { RoleQuery, RoleVO, RoleDeptTree, IStatusParam } from "./types"
import { Http } from "@user-admin/api"

export const listRole = (query: RoleQuery): AxiosPromise<RoleVO[]> => {
  return Http.request({
    url: "/admin/SysRole/page",
    method: "post",
    data: query
  })
}

/**
 * 查询角色详细
 */
export const getRole = (roleId: string | number): AxiosPromise<RoleVO> => {
  return Http.request({
    url: "/admin/SysRole/detail/" + roleId,
    method: "get"
  })
}

/**
 * 新增角色
 */
export const addRole = (query: any) => {
  return Http.request({
    url: "/admin/SysRole/save",
    method: "post",
    data: query
  })
}

/**
 * 修改角色
 * @param data
 */
export const updateRole = (query: any) => {
  return Http.request({
    url: "/admin/SysRole/modify",
    method: "put",
    data: query
  })
}

/**
 * 角色数据权限
 */
export const dataScope = (query: any) => {
  return Http.request({
    url: "/admin/SysRole/dataScope",
    method: "put",
    data: query
  })
}

/**
 * 角色状态修改
 */
export const changeRoleStatus = (query: IStatusParam) => {
  const { roleId, roleStatus } = query
  return Http.request({
    url: "/admin/SysRole/changeStatus",
    method: "put",
    data: {
      roleId,
      roleStatus
    }
  })
}

/**
 * 删除角色
 */
export const delRole = (roleId: Array<string | number> | string | number) => {
  return Http.request({
    url: "/admin/SysRole/remove/" + roleId,
    method: "delete"
  })
}

/**
 * 查询角色已授权用户列表
 */
export const allocatedUserList = (query: UserQuery): AxiosPromise<UserVO[]> => {
  return Http.request({
    url: "/admin/user/page/allocated",
    method: "post",
    data: query
  })
}

/**
 * 查询角色未授权用户列表
 */
export const unallocatedUserList = (query: UserQuery): AxiosPromise<UserVO[]> => {
  return Http.request({
    url: "/admin/user/page/unallocated",
    method: "post",
    data: query
  })
}

/**
 * 取消用户授权角色
 */
export const authUserCancel = (data: any) => {
  return Http.request({
    url: "/admin/SysRole/authUser/cancel",
    method: "put",
    data: data
  })
}

/**
 * 批量取消用户授权角色
 */
export const authUserCancelAll = (data: any) => {
  return Http.request({
    url: "/admin/SysRole/authUser/cancelAll",
    method: "put",
    params: data
  })
}

/**
 * 授权用户选择
 */
export const authUserSelectAll = (query: any) => {
  return Http.request({
    url: "/admin/SysRole/authUser/selectAll",
    method: "put",
    params: query
  })
}

// 根据角色ID查询部门树结构
export const deptTreeByRole = (roleId: string | number): AxiosPromise<RoleDeptTree> => {
  return Http.request({
    url: "/admin/SysRole/deptTree/" + roleId,
    method: "get"
  })
}
