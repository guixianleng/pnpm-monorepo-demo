import { defineApplicationConfig } from '@adv/vite-config';
import { createPlugins } from './build/vite-config'

export default defineApplicationConfig({
  overrides: {
    plugins: createPlugins(),
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true,
      https: false,
    }
  }
})