import { Http } from "@user-admin/api"
import { DictTypeForm, DictTypeVO, DictTypeQuery } from "./types"
import { AxiosPromise } from "axios"

// 查询字典类型列表
export function listType(query: DictTypeQuery): AxiosPromise<DictTypeVO[]> {
  return Http.request({
    url: "/admin/SysDictType/page",
    method: "post",
    data: query
  })
}

// 查询字典类型详细
export function getType(dictId: number | string): AxiosPromise<DictTypeVO> {
  return Http.request({
    url: "/admin/SysDictType/detail/" + dictId,
    method: "get"
  })
}

// 新增字典类型
export function addType(data: DictTypeForm) {
  return Http.request({
    url: "/admin/SysDictType/save",
    method: "post",
    data: data
  })
}

// 修改字典类型
export function updateType(data: DictTypeForm) {
  return Http.request({
    url: "/admin/SysDictType/modify",
    method: "put",
    data: data
  })
}

// 删除字典类型
export function delType(dictId: string | number | Array<string | number>) {
  return Http.request({
    url: "/admin/SysDictType/remove/" + dictId,
    method: "delete"
  })
}

// 刷新字典缓存
export function refreshCache() {
  return Http.request({
    url: "/admin/SysDictType/refreshCache",
    method: "delete"
  })
}

// 获取字典选择框列表
export function optionselect(): AxiosPromise<DictTypeVO[]> {
  return Http.request({
    url: "/admin/SysDictType/listAll",
    method: "post"
  })
}
