import { createWebHistory, createRouter } from "vue-router"
import { constantRoutes } from '@user-admin/router'

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

export default router
