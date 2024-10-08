import { defineStore } from "pinia"
import router, { constantRoutes } from "@user-admin/router"
import store from "@user-admin/store"
import { getRouters } from "@user-admin/api"
import auth from "@user-admin/plugins"
import { RouteRecordRaw } from "vue-router"

import Layout, { InnerLink } from "@user-admin/layout"
import { ParentView } from "@user-admin/components"
import { convertToUpperCamelCase } from "@user-admin/utils"

// 匹配views、system里面所有的.vue文件
const modules = import.meta.glob("./../../pages/**/*.vue")

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([])
  const addRoutes = ref<RouteRecordRaw[]>([])
  const defaultRoutes = ref<RouteRecordRaw[]>([])
  const topbarRouters = ref<RouteRecordRaw[]>([])
  const sidebarRouters = ref<RouteRecordRaw[]>([])

  const getRoutes = (): RouteRecordRaw[] => {
    return routes.value
  }
  const getSidebarRoutes = (): RouteRecordRaw[] => {
    return sidebarRouters.value
  }
  const getTopbarRoutes = (): RouteRecordRaw[] => {
    return topbarRouters.value
  }

  const setRoutes = (newRoutes: RouteRecordRaw[]): void => {
    addRoutes.value = newRoutes
    routes.value = constantRoutes.concat(newRoutes)
  }
  const setDefaultRoutes = (routes: RouteRecordRaw[]): void => {
    defaultRoutes.value = constantRoutes.concat(routes)
  }
  const setTopbarRoutes = (routes: RouteRecordRaw[]): void => {
    topbarRouters.value = routes
  }
  const setSidebarRouters = (routes: RouteRecordRaw[]): void => {
    sidebarRouters.value = routes
  }

  // 生成路由数据
  const generateRoutes = async (): Promise<RouteRecordRaw[]> => {
    // 调去后台菜单接口，获取菜单数据
    const res = await getRouters()
    const data = res.data
    data.forEach((item: any) => {
      if ((!item.children || !item.children.length) && item.component) {
        item.children = [{ ...item, path: "" }]
        item.component = "Layout"
      }
      if (!item?.component) item.component = "Layout"
    })
    const sdata = JSON.parse(JSON.stringify(data))
    const sidebarRoutes = filterAsyncRouter(sdata)
    type MenuItem = RouteRecordRaw & { fullPath: string[]; hidden: boolean }

    interface RemoveHiddenResult {
      updatedData: MenuItem[]
      removedItems: MenuItem[]
    }

    function removeHiddenItemsAndGetRemovedWithFullPath(
      data: MenuItem[],
      parentPath = []
    ): RemoveHiddenResult {
      const removedItems: MenuItem[] = []
      // 递归函数，用于处理子项并构建完整路径
      function processItems(items: MenuItem[], currentPath: string[]): MenuItem[] {
        const newItems: MenuItem[] = []
        for (const item of items) {
          const fullPath = [...currentPath, item.path]
          if (item.hidden === true) {
            // 如果当前项是隐藏的，则添加到 removedItems 数组，并跳过添加到 newItems
            removedItems.push({ ...item, fullPath })
          } else {
            newItems.push({ ...item, fullPath })
            if (item.children && item.children.length > 0) {
              // 递归处理子项
              item.children = processItems(item.children as MenuItem[], fullPath)
            }
          }
        }
        return newItems
      }
      // 调用递归函数处理数据
      const updatedData = processItems(data, parentPath)
      return {
        updatedData,
        removedItems
      }
    }

    const { updatedData, removedItems } = removeHiddenItemsAndGetRemovedWithFullPath(
      sidebarRoutes as MenuItem[]
    )

    removedItems.forEach(item => {
      const { hidden, fullPath } = item
      const route = {
        path: fullPath[0],
        component: Layout,
        hidden,
        children: [
          {
            path: item.path,
            component: item?.component,
            name: convertToUpperCamelCase(item.path),
            meta: {
              title: item.meta?.title,
              // 设置父级菜单高亮
              activeMenu: fullPath[0] + "/" + fullPath[1],
              // 关联tag是否显示当前的route
              hidden
            }
          }
        ]
      }
      router.addRoute(route as RouteRecordRaw)
    })
    setRoutes(updatedData)
    setSidebarRouters(constantRoutes.concat(updatedData))
    setDefaultRoutes(updatedData)
    setTopbarRoutes(updatedData)
    return new Promise<RouteRecordRaw[]>(resolve => resolve(updatedData))
  }

  /**
   * 遍历后台传来的路由字符串，转换为组件对象
   * @param asyncRouterMap 后台传来的路由字符串
   * @param lastRouter 上一级路由
   * @param type 是否是重写路由
   */
  const filterAsyncRouter = (
    asyncRouterMap: RouteRecordRaw[],
    lastRouter?: RouteRecordRaw,
    type = false
  ): RouteRecordRaw[] => {
    return asyncRouterMap.filter(route => {
      if (type && route.children) {
        route.children = filterChildren(route.children, undefined)
      }
      // Layout ParentView 组件特殊处理
      if (route.component?.toString() === "Layout") {
        route.component = Layout
      } else if (route.component?.toString() === "ParentView") {
        route.component = ParentView
      } else if (route.component?.toString() === "InnerLink") {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
      if (route.children != null && route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, route, type)
      } else {
        delete route.children
        delete route.redirect
      }
      return true
    })
  }
  const filterChildren = (
    childrenMap: RouteRecordRaw[],
    lastRouter?: RouteRecordRaw
  ): RouteRecordRaw[] => {
    let children: RouteRecordRaw[] = []
    childrenMap.forEach(el => {
      if (el.children && el.children.length) {
        if (el.component?.toString() === "ParentView" && !lastRouter) {
          el.children.forEach(c => {
            c.path = el.path + "/" + c.path
            if (c.children && c.children.length) {
              children = children.concat(filterChildren(c.children, c))
              return
            }
            children.push(c)
          })
          return
        }
      }
      if (lastRouter) {
        el.path = lastRouter.path + "/" + el.path
        if (el.children && el.children.length) {
          children = children.concat(filterChildren(el.children, el))
          return
        }
      }
      children = children.concat(el)
    })
    return children
  }
  return {
    routes,
    topbarRouters,
    sidebarRouters,
    defaultRoutes,

    getRoutes,
    getSidebarRoutes,
    getTopbarRoutes,

    setRoutes,
    generateRoutes,
    setSidebarRouters
  }
})

// 动态路由遍历，验证是否具备权限
export const filterDynamicRoutes = (routes: RouteRecordRaw[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route: any) => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view: any) => {
  let res
  for (const path in modules) {
    const dir = path.split("pages/")[1].split(".vue")[0]

    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

// 非setup
export const usePermissionStoreHook = () => {
  return usePermissionStore(store)
}

export default usePermissionStore
