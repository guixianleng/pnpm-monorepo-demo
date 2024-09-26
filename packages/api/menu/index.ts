import { Http } from "@user-admin/api"
import { AxiosPromise } from "axios"
import { MenuQuery, MenuVO, MenuForm, MenuTreeOption, RoleMenuTree } from "./types"

// 查询菜单列表
export const listMenu = (query?: MenuQuery): AxiosPromise<MenuVO[]> => {
  return Http.request({
    url: "/admin/SysMenu/getMenuByUser",
    method: "post",
    data: query
  })
}

// 查询菜单详细
export const getMenu = (menuId: string | number): AxiosPromise<MenuVO> => {
  return Http.request({
    url: "/admin/SysMenu/detail/" + menuId,
    method: "get"
  })
}

// 查询菜单下拉树结构
export const treeMenuselect = (): AxiosPromise<MenuTreeOption[]> => {
  return Http.request({
    url: "/system/menu/treeselect",
    method: "get"
  })
}

// 根据角色ID查询菜单下拉树结构
export const roleMenuTreeselect = (roleId: string | number): AxiosPromise<RoleMenuTree> => {
  return Http.request({
    url: "/admin/SysMenu/roleMenuTreeSelect/" + roleId,
    method: "get"
  })
}

// 根据角色ID查询菜单下拉树结构
export const tenantPackageMenuTreeselect = (
  packageId: string | number
): AxiosPromise<RoleMenuTree> => {
  return Http.request({
    url: "/system/menu/tenantPackageMenuTreeselect/" + packageId,
    method: "get"
  })
}

// 新增菜单
export const addMenu = (data: MenuForm) => {
  return Http.request({
    url: "/admin/SysMenu/save",
    method: "post",
    data: data
  })
}

// 修改菜单
export const updateMenu = (data: MenuForm) => {
  return Http.request({
    url: "/admin/SysMenu/modify",
    method: "put",
    data: data
  })
}

// 删除菜单
export const delMenu = (menuId: string | number) => {
  return Http.request({
    url: "/admin/SysMenu/remove/" + menuId,
    method: "delete"
  })
}
