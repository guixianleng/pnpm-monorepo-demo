import Layout from "./src/index.vue"
import InnerLink from "./src/components/InnerLink/index.vue"

import { withInstall } from "@user-admin/utils"

const AdvLayout = withInstall(Layout)

export default AdvLayout

export { InnerLink }
