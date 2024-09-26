import NotAuth from "./401.vue"
import NotFound from "./404.vue"

import { withInstall } from "@user-admin/utils"

const Adv401 = withInstall(NotAuth)
const Adv404 = withInstall(NotFound)

export { Adv401, Adv404 }
