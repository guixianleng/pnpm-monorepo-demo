import type { Component, App } from "vue"
import { provideGlobalConfig, type ConfigProviderContext } from "@user-admin/hooks"

import AdvLayout from "../layout"
import AdvDeptManage from "./system/dept"
import { AdvDictType, AdvDictData } from "./system/dict"
import AdvMenuManage from "./system/menu"
import AdvPostManage from "./system/post"
import { AdvRoleManage, AdvRoleAuth } from "./system/role"
import { AdvUserManage, AdvUserAuth } from "./system/user"
import AdvTenantManage from "./system/tenant"
import AdvLogin from "./login"
import AdvRedirect from "./redirect"
import AdvHome from "./home"
import { Adv401, Adv404 } from "./error"

const components: { [propName: string]: Component } = [
  AdvLayout,
  AdvDeptManage,
  AdvDictType,
  AdvDictData,
  AdvMenuManage,
  AdvPostManage,
  AdvRoleManage,
  AdvRoleAuth,
  AdvUserManage,
  AdvUserAuth,
  AdvTenantManage,
  AdvLogin,
  AdvRedirect,
  AdvHome,
  Adv401,
  Adv404
]

const install = (app: App, options?: ConfigProviderContext) => {
  console.log(options, "config-options")

  app.config.globalProperties.$baseUrl = options?.baseUrl

  for (const key in components) {
    app.component(key, components[key])
  }

  if (options) provideGlobalConfig(options, app, true)
}

// @ts-ignore
if (typeof window !== "undefined" && window.Vue) {
  // @ts-ignore
  install(window.Vue)
}

// 导出对应的工具类、自定义指令
export * as utils from "@user-admin/utils"
export * from "@user-admin/directive"
export * as advStore from "@user-admin/store"
export * from "@user-admin/router"
export * as advApi from "@user-admin/api"
export * from "../styles/index.scss"

// 按需引入
export {
  AdvLayout,
  AdvDeptManage,
  AdvDictType,
  AdvDictData,
  AdvMenuManage,
  AdvPostManage,
  AdvRoleManage,
  AdvRoleAuth,
  AdvUserManage,
  AdvUserAuth,
  AdvTenantManage,
  AdvLogin,
  AdvRedirect,
  AdvHome,
  Adv401,
  Adv404
}

// 导出的对象必须具有 install，才能被 Vue.use() 方法安装
export default { install }
