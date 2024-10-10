import type { InjectionKey, Ref } from "vue"
import type { Router } from "vue-router"
import type { Pinia } from "pinia"

export interface ConfigProviderContext {
  router: Router
  store: Pinia
  baseUrl: string
}

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderContext>> = Symbol()
