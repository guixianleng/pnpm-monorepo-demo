import cache from './cache'

import { App } from 'vue'

export default function installPlugin(app: App) {
  // 缓存对象
  app.config.globalProperties.$cache = cache
}
