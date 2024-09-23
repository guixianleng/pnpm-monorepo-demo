import { defineApplicationConfig } from '@adv/vite-config';

export default defineApplicationConfig({
  overrides: {
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true,
      https: false,
    }
  }
})