/**
 * 菜单树形结构类型
 */
export interface DeptTreeOption {
  id: string
  label: string
  parentId: string
  weight: number
  children?: DeptTreeOption[]
}

export interface RoleDeptTree {
  checkedKeys: string[]
  depts: DeptTreeOption[]
}

export interface RoleVO extends BaseEntity {
  roleId: string | number
  roleName: string
  roleCode: string
  roleSort: number
  dataScope: string
  menuCheckStrictly: boolean
  deptCheckStrictly: boolean
  roleStatus: string | number
  delFlag: string
  roleRemark?: any
  isRoot: number
  menuIds?: Array<string | number>
  deptIds?: Array<string | number>
  admin: boolean
}

export interface RoleQuery extends PageQuery {
  roleName?: string
  roleCode?: string
  roleStatus?: string | number
  param?: {
    beginTime: string
    endTime: string
  }
}

export interface RoleForm {
  roleName: string
  roleCode: string
  roleSort: number
  roleStatus: string | number
  menuCheckStrictly: boolean
  deptCheckStrictly: boolean
  roleRemark: string
  dataScope?: string
  roleId: string | undefined
  menuIds: Array<string | number>
  deptIds: Array<string | number>
}

export interface IStatusParam {
  roleId: string | number
  roleStatus: string
}
