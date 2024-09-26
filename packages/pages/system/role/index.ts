import RoleManage from "./index.vue"
import RoleAuth from "./authUser.vue"

import { withInstall } from "@user-admin/utils"

const AdvRoleManage = withInstall(RoleManage)
const AdvRoleAuth = withInstall(RoleAuth)

export { AdvRoleManage, AdvRoleAuth }
