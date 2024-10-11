import { defineComponent, renderSlot } from "vue"
import { provideGlobalConfig } from "./hooks/use-global-config"
import { configProviderProps } from "./props"

export const messageConfig: MessageConfigContext = {}

const ConfigProvider = defineComponent({
  name: "AdvConfigProvider",
  props: configProviderProps,

  setup(props, { slots }) {
    const config = provideGlobalConfig(props)
    return () => renderSlot(slots, "default", { config: config?.value })
  }
})
export type ConfigProviderInstance = InstanceType<typeof ConfigProvider>

export default ConfigProvider
