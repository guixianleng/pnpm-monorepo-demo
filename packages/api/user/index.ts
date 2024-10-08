import type { DeptVO, RoleVO } from "@user-admin/types"
import { Http } from "@user-admin/api"
import { AxiosPromise } from "axios"
import { UserForm, UserQuery, UserVO, UserInfoVO } from "./types"
import { parseStrEmpty } from "@user-admin/utils"

/**
 * 查询用户列表
 * @param query
 */
export const listUser = (query: UserQuery): AxiosPromise<UserVO[]> => {
  return Http.request({
    url: "/admin/user/page",
    method: "post",
    data: query
  })
}

/**
 * 查询所有用户列表
 * @param query
 */
export const listUserAll = (): AxiosPromise<UserVO[]> => {
  return Http.request({
    url: "/admin/user/listAll",
    method: "post"
  })
}

/**
 * 获取用户详情
 * @param userId
 */
export const getUser = (userId?: string | number): AxiosPromise<UserInfoVO> => {
  return Http.request({
    url: "/admin/user/detail/" + parseStrEmpty(userId),
    method: "get"
  })
}

/**
 * 新增用户
 */
export const addUser = (data: UserForm) => {
  return Http.request({
    url: "/admin/user/save",
    method: "post",
    data: data
  })
}

/**
 * 修改用户
 */
export const updateUser = (data: UserForm) => {
  return Http.request({
    url: "/admin/user/modify",
    method: "put",
    data: data
  })
}
/**
 * 修改用户状态
 */
export const updateUserStatus = (data: any) => {
  return Http.request({
    url: "/admin/user/updateStatus",
    method: "put",
    data: data
  })
}
export const updatePassword = (data: UserForm) => {
  return Http.request({
    url: "/admin/user/resetPwd",
    method: "put",
    data: data
  })
}
/**
 * 删除用户
 * @param userId 用户ID
 */
export const delUser = (userId: Array<string | number> | string | number) => {
  return Http.request({
    url: "/admin/user/remove/" + userId,
    method: "delete"
  })
}

/**
 * 用户密码重置
 * @param userId 用户ID
 * @param password 密码
 */
export const resetUserPwd = (userId: string | number, password: string) => {
  const data = {
    userId,
    password
  }
  return Http.request({
    url: "/system/user/resetPwd",
    method: "put",
    headers: {
      isEncrypt: true
    },
    data: data
  })
}

/**
 * 用户状态修改
 * @param userId 用户ID
 * @param status 用户状态
 */
export const changeUserStatus = (userId: number | string, status: string) => {
  const data = {
    userId,
    status
  }
  return Http.request({
    url: "/system/user/changeStatus",
    method: "put",
    data: data
  })
}

/**
 * 查询用户个人信息
 */
export const getUserProfile = (): AxiosPromise<UserInfoVO> => {
  return Http.request({
    url: "/system/user/profile",
    method: "get"
  })
}

/**
 * 修改用户个人信息
 * @param data 用户信息
 */
export const updateUserProfile = (data: UserForm) => {
  return Http.request({
    url: "/system/user/profile",
    method: "put",
    data: data
  })
}

/**
 * 用户密码重置
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export const updateUserPwd = (oldPassword: string, newPassword: string) => {
  const data = {
    oldPassword,
    newPassword
  }
  return Http.request({
    url: "/system/user/profile/updatePwd",
    method: "put",
    headers: {
      isEncrypt: true
    },
    data: data
  })
}

/**
 * 用户头像上传
 * @param data 头像文件
 */
export const uploadAvatar = (data: FormData) => {
  return Http.request({
    url: "/system/user/profile/avatar",
    method: "post",
    data: data
  })
}

/**
 * 查询授权角色
 * @param userId 用户ID
 */
export const getAuthRole = (
  userId: string | number
): AxiosPromise<{ user: UserVO; roles: RoleVO[] }> => {
  return Http.request({
    url: "/system/user/authRole/" + userId,
    method: "get"
  })
}

/**
 * 保存授权角色
 * @param data 用户ID
 */
export const updateAuthRole = (data: { userId: string; roleIds: string[] }) => {
  return Http.request({
    url: "/admin/user/auth-role",
    method: "put",
    data: data
  })
}

/**
 * 查询当前部门的所有用户信息
 * @param deptId
 */
export const listUserByDeptId = (deptId: string | number): AxiosPromise<UserVO[]> => {
  return Http.request({
    url: "/system/user/list/dept/" + deptId,
    method: "get"
  })
}

/**
 * 查询部门下拉树结构
 */
export const deptTreeSelect = (): AxiosPromise<DeptVO[]> => {
  return Http.request({
    url: "/system/user/deptTree",
    method: "get"
  })
}

export default {
  listUser,
  getUser,
  addUser,
  updateUser,
  delUser,
  resetUserPwd,
  changeUserStatus,
  getUserProfile,
  updateUserProfile,
  updateUserPwd,
  uploadAvatar,
  getAuthRole,
  updateAuthRole,
  deptTreeSelect,
  listUserByDeptId
}
