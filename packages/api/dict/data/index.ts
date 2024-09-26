import { Http } from "@user-admin/api"
import { AxiosPromise } from "axios"
import { DictDataForm, DictDataQuery, DictDataVO } from "./types"
// 根据字典类型查询字典数据信息
export function getDicts(dictType: string): AxiosPromise<DictDataVO[]> {
  return Http.request({
    url: "/admin/SysDictData/type/" + dictType,
    method: "get"
  })
}

// 查询字典数据列表
export function listData(query: DictDataQuery): AxiosPromise<DictDataVO[]> {
  return Http.request({
    url: "/admin/SysDictData/page",
    method: "post",
    data: query
  })
}

// 查询字典数据详细
export function getData(id: string | number): AxiosPromise<DictDataVO> {
  return Http.request({
    url: "/admin/SysDictData/detail/" + id,
    method: "get"
  })
}

// 新增字典数据
export function addData(data: DictDataForm) {
  return Http.request({
    url: "/admin/SysDictData/save",
    method: "post",
    data: data
  })
}

// 修改字典数据
export function updateData(data: DictDataForm) {
  return Http.request({
    url: "/admin/SysDictData/modify",
    method: "put",
    data: data
  })
}

// 删除字典数据
export function delData(dictCode: string | number | Array<string | number>) {
  return Http.request({
    url: "/admin/SysDictData/remove/" + dictCode,
    method: "delete"
  })
}
