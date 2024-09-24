import { createApp } from 'vue'
import './style.css'
import 'element-plus/dist/index.css'

import App from './App.vue'
import AdvUi from '@adv/components'

createApp(App).use(AdvUi).mount('#app')
