import type { Component, App } from "vue"

import Adv3dLoader from "./3d-loader"

// 存储组件列表
const components: {
  [propName: string]: Component
} = {
  Adv3dLoader
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

// 按需引入
export { Adv3dLoader }

// 导出的对象必须具有 install，才能被 Vue.use() 方法安装
export default { install }
