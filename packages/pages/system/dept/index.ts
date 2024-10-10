import { withInstall } from "@user-admin/utils"
import DeptManage from "./index.vue"
import type { SFCWithInstall } from "@user-admin/utils"

const AdvDeptManage: SFCWithInstall<typeof DeptManage> = withInstall(DeptManage)

export default AdvDeptManage
