import { withInstall } from "@user-admin/utils"
import ConfigProvider from "./src/config-provider"
import type { SFCWithInstall } from "@user-admin/utils"

export const AdvConfigProvider: SFCWithInstall<typeof ConfigProvider> = withInstall(ConfigProvider)
export default AdvConfigProvider

export * from "./src/config-provider"
export * from "./src/props"
export * from "./src/type"
export * from "./src/hooks/use-global-config"
