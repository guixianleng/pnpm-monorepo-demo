import type { Component, App } from "vue"

import AdvLayoutPage from "./layout-page"
import AdvLayoutPageItem from "./layout-page-item"
import AdvButton from "./button"
import AdvAddMinus from "./add-minus"
import AdvCheckboxGroup from "./checkbox-group"
import AdvClickOutside from "./click-outside"
import AdvCountTo from "./count-to"

// 存储组件列表
const components: {
  [propName: string]: Component
} = {
  AdvLayoutPage,
  AdvLayoutPageItem,
  AdvButton,
  AdvAddMinus,
  AdvCheckboxGroup,
  AdvClickOutside,
  AdvCountTo
}

// - install：每个插件都有一个 install 方法
// - 参数：是通过 Vue.createApp() 创建的 app 实例
const install = (app: App) => {
  // console.log(options, 'config-options')
  // const configProvider = deepMerge(config, options) // 合并值
  // app.config.globalProperties["config-provider"] = configProvider
  // app.provide("configProvider", readonly(configProvider))
  for (const key in components) {
    app.component(key, components[key])
  }
}

// @ts-ignore
if (typeof window !== "undefined" && window.Vue) {
  // @ts-ignore
  install(window.Vue)
}

// 按需引入
export {
  AdvLayoutPage,
  AdvLayoutPageItem,
  AdvButton,
  AdvAddMinus,
  AdvCheckboxGroup,
  AdvClickOutside,
  AdvCountTo
}

// 导出的对象必须具有 install，才能被 Vue.use() 方法安装
export default { install }
