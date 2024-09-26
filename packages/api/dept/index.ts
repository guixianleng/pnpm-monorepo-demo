import { Http } from "@user-admin/api"
import { AxiosPromise } from "axios"
import { DeptForm, DeptQuery, DeptVO } from "./types"

// 查询部门列表
export const listDept = (query?: DeptQuery) => {
  return Http.request({
    url: "/admin/dept/page",
    method: "post",
    data: query
  })
}

// 查询所有部门列表
export const listDeptAll = () => {
  return Http.request({
    url: "/admin/dept/listAll",
    method: "post"
  })
}

// 查询部门列表（排除节点）
export const listDeptExcludeChild = (deptId: string | number): AxiosPromise<DeptVO[]> => {
  return Http.request({
    url: "/admin/system/dept/list/exclude/" + deptId,
    method: "get"
  })
}

// 查询部门详细
export const getDept = (deptId: string | number): AxiosPromise<DeptVO> => {
  return Http.request({
    url: "/admin/dept/detail/" + deptId,
    method: "get"
  })
}

// 查询部门下拉树结构
export const treeDeptselect = (): AxiosPromise<DeptVO[]> => {
  return Http.request({
    url: "/admin/system/dept/treeselect",
    method: "get"
  })
}

// 新增部门
export const addDept = (data: DeptForm) => {
  return Http.request({
    url: "/admin/dept/save",
    method: "post",
    data: data
  })
}

// 修改部门
export const updateDept = (data: DeptForm) => {
  return Http.request({
    url: "/admin/dept/modify",
    method: "put",
    data: data
  })
}

// 删除部门
export const delDept = (deptId: number | string) => {
  return Http.request({
    url: "/admin/dept/remove/" + deptId,
    method: "delete"
  })
}
