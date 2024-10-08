import { createPinia } from "pinia"
//引入持久化插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

import useAppStore from "./modules/app"
import useDictStore from "./modules/dict"
import useNoticeStore from "./modules/notice"
import usePermissionStore from "./modules/permission"
import useSettingsStore from "./modules/settings"
import useTagsViewStore from "./modules/tagsView"
import useUserStore from "./modules/user"

const store = createPinia()

store.use(piniaPluginPersistedstate)

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
