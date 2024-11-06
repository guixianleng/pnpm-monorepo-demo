import { resolve } from 'node:path';
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'

export default (path: any) => {
  return Components({
    resolvers: [
      // 自动导入 Element Plus 组件
      ElementPlusResolver(),
    ],
    dts: resolve(resolve(__dirname, '../../'), 'types', 'components.d.ts'),
  })
}
