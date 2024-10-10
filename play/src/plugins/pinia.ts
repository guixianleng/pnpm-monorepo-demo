import { createPinia } from "pinia"
//引入持久化插件
import persistedstate from "pinia-plugin-persistedstate"

const store = createPinia()

store.use(persistedstate)

export default store