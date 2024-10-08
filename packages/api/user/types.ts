import type { RoleVO, PostVO } from "@user-admin/types"

/**
 * 用户信息
 */
export interface UserInfo {
  user: UserVO
  roles: string[]
  permissions: string[]
  [key: string]: any
}

/**
 * 用户查询对象类型
 */
export interface UserQuery extends PageQuery {
  userName?: string
  phonenumber?: string
  status?: string
  deptId?: string | number
  roleId?: string | number
}

/**
 * 用户返回对象
 */
export interface UserVO extends BaseEntity {
  deptId: string
  deptName: string
  userId: string
  userName: string
  userStatus: string
  userPhone: string
  roleIds: string
  tenantId: string
  [key: string]: any
}

/**
 * 用户表单类型
 */
export interface UserForm {
  id?: string
  userId?: string
  deptId?: number
  userName?: string
  nickName?: string
  password?: string
  userPwd?: string
  phonenumber?: string
  email?: string
  sex?: string
  userStatus?: string
  remark?: string
  postIds?: string[]
  roleIds?: string[]
}

export interface UserInfoVO {
  user: UserVO
  roles: RoleVO[]
  roleIds: string[]
  posts: PostVO[]
  postIds: string[] | number[]
  roleGroup: string
  postGroup: string
}

export interface ResetPwdForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
