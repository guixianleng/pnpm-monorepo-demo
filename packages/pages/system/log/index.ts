import LoginLog from "./login/index.vue"
import OperateLog from "./oper/index.vue"

import { withInstall } from "@user-admin/utils"

const AdvLoginLog = withInstall(LoginLog)
const AdvOperateLog = withInstall(OperateLog)

export { AdvLoginLog, AdvOperateLog }
