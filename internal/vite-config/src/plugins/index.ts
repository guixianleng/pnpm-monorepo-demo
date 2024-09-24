import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import createAutoImport from './auto-import'
import createComponents from './components'
import createIcons from './icons'
// import ElementPlus from 'unplugin-element-plus/vite'

import { configCompressPlugin } from './compress';
import { configVisualizerConfig } from './visualizer';

interface Options {
  isBuild: boolean;
  compress: string;
  enableAnalyze?: boolean;
}

async function createPlugins({ isBuild, compress, enableAnalyze }: Options) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue(),
    vueJsx(),
    dts({
      outDir: 'lib/types',
      copyDtsFiles: true
    }),
    VueSetupExtend(),
    createAutoImport(),
    createComponents(),
    createIcons()
  ];

  if (isBuild) {
    vitePlugins.push(
      // 开启压缩
      configCompressPlugin({
        compress,
      }),
      // 解决打包组件的语言默认为英文
      // ElementPlus({
      //   // 指定语言为中文简体，你也可以设置为'en'、'ja'等
      //   defaultLocale: 'zh-cn',
      // }),
    );
    
  }

  // 开启打包分析
  if (enableAnalyze) {
    vitePlugins.push(configVisualizerConfig());
  }

  return vitePlugins;
}

export { createPlugins };