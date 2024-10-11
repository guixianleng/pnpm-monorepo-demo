import { type ExtractPropTypes, PropType } from "vue"
import type { Router } from "vue-router"
import type { Pinia } from "pinia"

export const configProviderProps = {
  router: {
    type: Object as PropType<Router>
  },
  store: {
    type: Object as PropType<Pinia>
  },
  baseUrl: {
    type: String
  }
}

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
