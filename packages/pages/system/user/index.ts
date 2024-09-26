import UserManage from "./index.vue"
import UserAuth from "./authRole.vue"

import { withInstall } from "@user-admin/utils"

const AdvUserManage = withInstall(UserManage)
const AdvUserAuth = withInstall(UserAuth)

export { AdvUserManage, AdvUserAuth }
