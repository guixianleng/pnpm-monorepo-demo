import { createApp } from 'vue'
import './style.css'

import vue3dLoader from '../../packages/3d-loader'

import App from './App.vue'

createApp(App).use(vue3dLoader).mount('#app')
