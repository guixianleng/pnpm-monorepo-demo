import { MenuTypeEnum } from "../../enums/menuEnum"

/**
 * 菜单查询参数类型
 */
export interface MenuQuery {
  menuName?: string
  menuStatus?: string
}

/**
 * 菜单视图对象类型
 */
export interface MenuVO extends BaseEntity {
  parentName: string
  parentId: string | number
  children: MenuVO[]
  menuId: string | number
  menuName: string
  orderNum: number
  menuUrl: string
  component: string
  isFrame: string
  isCache: string
  menuType: MenuTypeEnum
  visible: string
  menuStatus: string
  menuIcon: string
  menuRemark: string
  menuPerms?: string
}

export interface MenuForm {
  parentId?: string | number
  menuId?: string | number
  menuName: string
  orderNum: number
  menuUrl: string
  component?: string
  isFrame?: string
  isCache?: string
  menuType?: MenuTypeEnum
  visible?: string
  menuStatus?: string
  menuIcon?: string
  menuRemark?: string
  menuPerms?: string
}

export interface MenuTreeOption {
  id: string | number
  label: string
  parentId: string | number
  weight: number
  children?: MenuTreeOption[]
}

export interface RoleMenuTree {
  menus: MenuTreeOption[]
  checkedKeys: string[]
}
