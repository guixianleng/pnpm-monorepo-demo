import DictType from "./index.vue"
import DictData from "./data.vue"

import { withInstall } from "@user-admin/utils"

const AdvDictType = withInstall(DictType)
const AdvDictData = withInstall(DictData)

export { AdvDictType, AdvDictData }
