// import router from "@user-admin/router"
import { RouteLocationMatched, RouteLocationNormalized } from "vue-router"
import { useTagsViewStore } from "@user-admin/store"

import { useGlobalConfig } from "@user-admin/hooks"

export default {
  /**
   * 刷新当前tab页签
   * @param obj 标签对象
   */
  async refreshPage(obj?: RouteLocationNormalized): Promise<void> {
    const globalConfig = useGlobalConfig()
    const { path, query, matched } = unref(globalConfig).router.currentRoute.value
    if (obj === undefined) {
      matched.forEach((m: RouteLocationMatched) => {
        if (m.components && m.components.default && m.components.default.name) {
          if (!["Layout", "ParentView"].includes(m.components.default.name)) {
            // @ts-ignore
            obj = {
              name: m.components.default.name,
              path: path,
              query: query,
              matched: [],
              fullPath: "",
              hash: "",
              params: {},
              meta: {}
            }
          }
        }
      })
    }
    let query1: undefined | object = {}
    let path1: undefined | string = ""
    if (obj) {
      query1 = obj.query
      path1 = obj.path
    }
    await useTagsViewStore().delCachedView(obj)
    await unref(globalConfig).router.replace({
      path: "/redirect" + path1,
      query: query1 as any
    })
  },
  // 关闭当前tab页签，打开新页签
  closeOpenPage(obj: RouteLocationNormalized): void {
    const globalConfig = useGlobalConfig()
    useTagsViewStore().delView(unref(globalConfig).router.currentRoute.value)
    if (obj !== undefined) {
      unref(globalConfig).router.push(obj)
    }
  },
  // 关闭指定tab页签
  async closePage(
    obj?: RouteLocationNormalized
  ): Promise<{ visitedViews: RouteLocationNormalized[]; cachedViews: string[] } | any> {
    const globalConfig = useGlobalConfig()
    if (obj === undefined) {
      // prettier-ignore
      const { visitedViews } = await useTagsViewStore().delView(unref(globalConfig).router.currentRoute.value)
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        return unref(globalConfig).router.push(latestView.fullPath)
      }
      return unref(globalConfig).router.push("/")
    }
    return useTagsViewStore().delView(obj)
  },
  // 关闭所有tab页签
  closeAllPage() {
    return useTagsViewStore().delAllViews()
  },
  // 关闭左侧tab页签
  closeLeftPage(obj?: RouteLocationNormalized) {
    const globalConfig = useGlobalConfig()
    return useTagsViewStore().delLeftTags(obj || unref(globalConfig).router.currentRoute.value)
  },
  // 关闭右侧tab页签
  closeRightPage(obj?: RouteLocationNormalized) {
    const globalConfig = useGlobalConfig()
    return useTagsViewStore().delRightTags(obj || unref(globalConfig).router.currentRoute.value)
  },
  // 关闭其他tab页签
  closeOtherPage(obj?: RouteLocationNormalized) {
    const globalConfig = useGlobalConfig()
    return useTagsViewStore().delOthersViews(obj || unref(globalConfig).router.currentRoute.value)
  },
  /**
   * 打开tab页签
   * @param url 路由地址
   * @param title 标题
   * @param query 参数
   */
  openPage(url: string, title?: string, query?: any) {
    const globalConfig = useGlobalConfig()
    const obj = { path: url, query: { ...query, title } }
    return unref(globalConfig).router.push(obj)
  },
  /**
   * 修改tab页签
   * @param obj 标签对象
   */
  updatePage(obj: RouteLocationNormalized) {
    return useTagsViewStore().updateVisitedView(obj)
  }
}
