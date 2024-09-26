import { createPinia } from "pinia"
import useAppStore from "./modules/app"
import useDictStore from "./modules/dict"
import useNoticeStore from "./modules/notice"
import usePermissionStore from "./modules/permission"
import useSettingsStore from "./modules/settings"
import useTagsViewStore from "./modules/tagsView"
import useUserStore from "./modules/user"

const store = createPinia()

export default store

export {
  useAppStore,
  useDictStore,
  useNoticeStore,
  usePermissionStore,
  useSettingsStore,
  useTagsViewStore,
  useUserStore
}
