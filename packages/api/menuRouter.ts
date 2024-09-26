import { Http } from "@user-admin/api"
import { AxiosPromise } from "axios"
import { RouteRecordRaw } from "vue-router"

// 获取路由
export const getRouters = (): AxiosPromise<RouteRecordRaw[]> => {
  return Http.request({
    url: "/admin/SysMenu/getRouters",
    method: "get"
  })
}
