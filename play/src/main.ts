import { createApp } from 'vue'
import '../../packages/styles/index.scss'
import '../../packages/styles/tailwindcss.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'advint-ui/dist/style.css'

import App from './App.vue'
import router from '@user-admin/router'
import store from '@user-admin/store'

// 自定义指令
import directive from '@user-admin/directive'

// 注册插件
import plugins from './plugins/index'

// svg图标
import 'virtual:svg-icons-register'
import ElementIcons from './plugins/svgicon'

// 权限控制
import './permission'

const app = createApp(App)

// 自定义指令
directive(app)

app.use(ElementIcons).use(store).use(router).use(plugins).mount('#app')