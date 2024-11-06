import type { Component, App } from "vue"

import AdvLayoutPage from "./layout-page"
import AdvLayoutPageItem from "./layout-page-item"
import AdvButton from "./button"
import AdvCheckboxGroup from "./checkbox-group"
import AdvClickOutside from "./click-outside"

// 存储组件列表
const components: {
  [propName: string]: Component
} = {
  AdvLayoutPage,
  AdvLayoutPageItem,
  AdvButton,
  AdvCheckboxGroup,
  AdvClickOutside
}

// - install：每个插件都有一个 install 方法
// - 参数：是通过 Vue.createApp() 创建的 app 实例
const install = (app: App) => {
  for (const key in components) {
    app.component(key, components[key])
  }
}

// @ts-ignore
if (typeof window !== "undefined" && window.Vue) {
  // @ts-ignore
  install(window.Vue)
}

/**
 * @description 公共方法
 */
export * from "@adv/utils"

// 按需引入
export { AdvLayoutPage, AdvLayoutPageItem, AdvButton, AdvCheckboxGroup, AdvClickOutside }

// 导出的对象必须具有 install，才能被 Vue.use() 方法安装
export default { install }
