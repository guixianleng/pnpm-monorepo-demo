import type { InjectionKey, Ref } from "vue"
import type { Router } from "vue-router"
import type { Pinia } from "pinia"

export interface ConfigProviderContext {
  router: Router
  store: Pinia
  // 接口地址
  baseUrl: string
  // 内链页面的路径模块
  pageModules: any
}

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderContext>> = Symbol()
