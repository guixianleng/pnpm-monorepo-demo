import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router"
import Layout from "@user-admin/layout"
import { Adv401, Adv404, AdvRedirect, AdvHome, AdvLogin } from "@user-admin/pages"

declare module "vue-router" {
  interface _RouteRecordBase {
    hidden?: boolean | string | number
    permissions?: string[]
  }
}

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: () => Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => AdvRedirect
      }
    ]
  },
  {
    path: "/login",
    component: () => AdvLogin,
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => Adv404,
    hidden: true
  },
  {
    path: "/401",
    component: () => Adv401,
    hidden: true
  },
  {
    path: "",
    component: () => Layout,
    redirect: "/index",
    children: [
      {
        path: "/index",
        component: () => AdvHome,
        name: "Index",
        meta: { title: "首页", icon: "dashboard", affix: true }
      }
    ]
  }
]

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

export default router
