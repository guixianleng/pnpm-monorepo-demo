import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router"

declare module "vue-router" {
  interface _RouteRecordBase {
    hidden?: boolean | string | number
    permissions?: string[]
  }
}

/* Layout */
import Layout from "@user-admin/layout"
import {
  Adv401,
  Adv404,
  AdvRedirect,
  AdvHome,
  AdvLogin,
  AdvDictData,
  AdvRoleAuth,
  AdvUserAuth
} from "@user-admin/pages"

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: AdvRedirect
      }
    ]
  },
  {
    path: "/login",
    component: AdvLogin,
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: Adv404,
    hidden: true
  },
  {
    path: "/401",
    component: Adv401,
    hidden: true
  },
  // {
  //   path: "/500",
  //   component: () => import("~/pages/error/500.vue"),
  //   hidden: true
  // },
  // {
  //   path: "/offline",
  //   component: () => import("~/pages/error/offline.vue"),
  //   hidden: true
  // },
  {
    path: "",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "/index",
        component: AdvHome,
        name: "Index",
        meta: { title: "首页", icon: "dashboard", affix: true }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/system/user-auth",
    component: Layout,
    hidden: true,
    permissions: ["system:user:role"],
    children: [
      {
        path: "role/:userId(\\d+)",
        component: AdvUserAuth,
        name: "AuthRole",
        meta: { title: "分配角色", activeMenu: "/system/user", icon: "" }
      }
    ]
  },
  {
    path: "/system/role-auth",
    component: Layout,
    hidden: true,
    permissions: ["system:role:edit"],
    children: [
      {
        path: "user/:roleId(\\d+)",
        component: AdvRoleAuth,
        name: "AuthUser",
        meta: { title: "分配用户", activeMenu: "/system/role", icon: "" }
      }
    ]
  },
  {
    path: "/system/dict-data",
    component: Layout,
    hidden: true,
    permissions: ["system:dict:list"],
    children: [
      {
        path: "index/:dictId(\\d+)",
        component: AdvDictData,
        name: "Data",
        meta: { title: "字典数据", activeMenu: "/system/dict", icon: "" }
      }
    ]
  }
]

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_CONTEXT_PATH),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
