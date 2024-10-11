import type { InjectionKey, Ref } from "vue"
import type { ConfigProviderProps } from "./props"

// export interface ConfigProviderContext {
//   router: Router
//   store: Pinia
//   baseUrl: string
// }
export type ConfigProviderContext = Partial<ConfigProviderProps>

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderContext>> = Symbol()
