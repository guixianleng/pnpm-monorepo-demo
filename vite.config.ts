import { defineApplicationConfig } from '@adv/vite-config';

export default defineApplicationConfig({
  overrides: {
    server: {
      host: '0.0.0.0',
      port: 3300,
      open: true,
      https: false,
      proxy: {
        '^/basic-api': {
          target: `http://localhost:3000`,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/basic-api`), ''),
        },
      },
    },
  }
})
