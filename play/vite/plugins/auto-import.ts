import { resolve } from 'node:path';
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'

export default (path: any) => {
  return AutoImport({
    // 自动导入 Vue 相关函数
    imports: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
    eslintrc: {
      enabled: false,
      filepath: './.eslintrc-auto-import.json',
      globalsPropValue: true,
    },
    resolvers: [
      // 自动导入 Element Plus 相关函数ElMessage, ElMessageBox... (带样式)
      ElementPlusResolver(),
      IconsResolver({
        prefix: 'Icon',
      }),
    ],
    // 是否在 vue 模板中自动导入
    vueTemplate: true,
    dts: resolve(resolve(__dirname, '../../'), 'types', 'auto-imports.d.ts'),
  })
}
