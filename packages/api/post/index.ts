import { Http } from "@user-admin/api"
import { PostForm, PostQuery, PostVO } from "./types"
import { AxiosPromise } from "axios"

// 查询岗位列表
export function listPost(query: PostQuery): AxiosPromise<PostVO[]> {
  return Http.request({
    url: "/admin/SysPost/page",
    method: "post",
    data: query
  })
}

// 查询岗位详细
export function getPost(postId: string | number): AxiosPromise<PostVO> {
  return Http.request({
    url: "/admin/SysPost/detail/" + postId,
    method: "get"
  })
}

// 新增岗位
export function addPost(data: PostForm) {
  return Http.request({
    url: "/admin/SysPost/save",
    method: "post",
    data: data
  })
}

// 修改岗位
export function updatePost(data: PostForm) {
  return Http.request({
    url: "/admin/SysPost/modify",
    method: "put",
    data: data
  })
}

// 删除岗位
export function delPost(postId: string | number | (string | number)[]) {
  return Http.request({
    url: "/admin/SysPost/remove/" + postId,
    method: "delete"
  })
}
