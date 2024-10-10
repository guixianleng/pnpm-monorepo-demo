import { createApp } from 'vue'
import '../../packages/styles/index.scss'

import App from './App.vue'
import router from './plugins/router'
import store from './plugins/pinia'
import adminUi from '@user-admin/pages'

// 自定义指令
import { vHasPermi } from '@user-admin/directive'

// svg图标
import 'virtual:svg-icons-register'
import ElementIcons from './plugins/svgicon'

// 权限控制
import './permission'

const app = createApp(App)

// 自定义指令
app.directive("hasPermi", vHasPermi)

app.use(ElementIcons).use(store).use(router).use(adminUi, {
  router,
  store,
  baseUrl: 'http://platform.dev.advint.cn/'
}).mount('#app')