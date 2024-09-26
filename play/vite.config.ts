import { defineApplicationConfig } from '@adv/vite-config';
import createPlugins from './vite/plugins'

import path from 'node:path'

export default defineApplicationConfig({
  overrides: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    server: {
      host: '0.0.0.0',
      port: 9583,
      open: true,
      https: false,
      proxy: {
        '/basic-api': {
          target: 'http://platform.dev.advint.cn/',
          changeOrigin: true,
          ws: true,
          rewrite: path => path.replace(new RegExp(`^/basic-api`), ''),
        },
      },
    },
    plugins: createPlugins(),
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          javascriptEnabled: true,
          // 自动导入定制化样式进行文件覆盖
          additionalData: `@use "@/styles/theme.scss" as *;`,
        }
      }
    },
  }
})