import { to as tos } from 'await-to-js'
import { isRelogin } from '@user-admin/api'
import { isHttp, getToken } from '@user-admin/utils'
import router from '@user-admin/router'
import { useUserStore, useSettingsStore, usePermissionStore } from '@user-admin/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

// 设置路由访问的白名单
const whiteList = [
  '/login',
  '/register'
]

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 有token情况下
  if (getToken()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else if (whiteList.indexOf(to.path as string) !== -1) {
      next()
    } else {
      if (useUserStore().roles.length === 0) {
        isRelogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        const [err] = await tos(useUserStore().getInfo())
        if (err) {
          await useUserStore().logout()
          ElMessage.error(err)
          next({ path: '/' })
        } else {
          isRelogin.show = false
          const accessRoutes = await usePermissionStore().generateRoutes()

          // 根据roles权限生成可访问的路由表
          accessRoutes.forEach(route => {
            if (!isHttp(route.path)) {
              router.addRoute(route) // 动态添加可访问路由表
            }
          })
          next({
            path: to.path,
            replace: true,
            params: to.params,
            query: to.query,
            hash: to.hash,
            name: to.name as string,
          }) // hack方法 确保addRoutes已完成
        }
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path as string) !== -1) {
      next()
    } else {
      const redirect = encodeURIComponent(to.fullPath || '/')
      next(`/login?redirect=${redirect}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
