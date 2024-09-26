import path from 'node:path'
import createAutoImport from './auto-import'
import createComponents from './components'
import createIcons from './icons'
import createSvgIconsPlugin from './svg-icon'
// 开始保存实时校验eslint
// import eslintPlugin from 'vite-plugin-eslint'

export default (): [] => {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    createAutoImport(),
    createComponents(),
    createIcons(),
    // eslintPlugin(),
    createSvgIconsPlugin()
  ];

  return vitePlugins
}
