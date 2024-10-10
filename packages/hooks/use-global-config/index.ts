import { computed, getCurrentInstance, inject, provide, ref, unref } from "vue"
import type { App, Ref } from "vue"
import type { MaybeRef } from "@vueuse/core"

import { configProviderContextKey, type ConfigProviderContext } from "./config-provider"

const globalConfig = ref<ConfigProviderContext>()

const keysOf = <T>(arr: T) => Object.keys(arr) as Array<keyof T>

const mergeConfig = (a: ConfigProviderContext, b: ConfigProviderContext): ConfigProviderContext => {
  const keys = [...new Set([...keysOf(a), ...keysOf(b)])]
  const obj: Record<string, any> = {}
  for (const key of keys) {
    obj[key] = b[key] !== undefined ? b[key] : a[key]
  }
  return obj
}

export function useGlobalConfig<
  K extends keyof ConfigProviderContext,
  D extends ConfigProviderContext[K]
>(key: K, defaultValue?: D): Ref<Exclude<ConfigProviderContext[K], undefined> | D>

export function useGlobalConfig(): Ref<ConfigProviderContext>

export function useGlobalConfig(key?: keyof ConfigProviderContext, defaultValue = undefined) {
  const config = getCurrentInstance()
    ? inject(configProviderContextKey, globalConfig)
    : globalConfig
  if (key) {
    return computed(() => config.value?.[key] ?? defaultValue)
  } else {
    return config
  }
}

export const provideGlobalConfig = (
  config: MaybeRef<ConfigProviderContext>,
  app?: App,
  global = false
) => {
  const inSetup = !!getCurrentInstance()
  const oldConfig = inSetup ? useGlobalConfig() : undefined

  const provideFn = app?.provide ?? (inSetup ? provide : undefined)
  if (!provideFn) {
    console.warn("provideGlobalConfig", "provideGlobalConfig() can only be used inside setup().")
    return
  }

  const context = computed(() => {
    const cfg = unref(config)
    if (!oldConfig?.value) return cfg
    return mergeConfig(oldConfig.value, cfg)
  })
  provideFn(configProviderContextKey, context)

  if (global || !globalConfig.value) {
    globalConfig.value = context.value
  }
  return context
}
