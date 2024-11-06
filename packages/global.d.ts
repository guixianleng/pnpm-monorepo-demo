import AdvLayoutPage from "./components/layout-page/src/index.vue"
import AdvLayoutPageItem from "./components/layout-page-item/src/index.vue"
import AdvButton from "./components/button/src/index.vue"
import AdvCheckboxGroup from "./components/checkbox-group/src/index.vue"
import AdvClickOutside from "./components/click-outside/src/index.vue"

declare module "vue" {
  export interface GlobalComponents {
    AdvLayoutPage: typeof AdvLayoutPage
    AdvLayoutPageItem: typeof AdvLayoutPageItem
    AdvButton: typeof AdvButton
    AdvCheckboxGroup: typeof AdvCheckboxGroup
    AdvClickOutside: typeof AdvClickOutside
  }
}
