import { resolve } from 'node:path';

import dayjs from 'dayjs';
import { readPackageJSON } from 'pkg-types';
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite';

import { createPlugins } from '../plugins';
import { commonConfig } from './common';

interface DefineOptions {
  overrides?: UserConfig;
  options?: {};
}

function defineApplicationConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions;

  return defineConfig(async ({ command, mode }) => {
    const root = process.cwd();
    const isBuild = command === 'build';
    const { VITE_PUBLIC_PATH, VITE_BUILD_COMPRESS, VITE_ENABLE_ANALYZE } = loadEnv(
      mode,
      root,
    );

    const defineData = await createDefineData(root);
    const plugins = await createPlugins({
      isBuild,
      enableAnalyze: VITE_ENABLE_ANALYZE === 'true',
      compress: VITE_BUILD_COMPRESS,
    });

    const pathResolve = (pathname: string) => resolve(root, '.', pathname);
    
    const applicationConfig: UserConfig = {
      base: VITE_PUBLIC_PATH,
      resolve: {
        // 类型： string[] 导入时想要省略的扩展名列表。
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs'],
      },
      define: defineData,
      css: {
        preprocessorOptions: {
          scss: {
            // 解决warning in Dart Sass 2.0.0
            api: "modern-compiler",
          }
      }
      build: {
        outDir: 'lib',
        target: 'es2015',
        cssTarget: 'chrome80',
        sourcemap: true,
        rollupOptions: {
          // 请确保外部化那些你的库中不需要的依赖
          external: ['vue'],
          output: {
            // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
            globals: {
              vue: 'Vue',
            },
          },
        },
        lib: {
          entry: pathResolve('packages') + '/pages/index.ts',
          formats: ['es', 'cjs'],
          name: 'advUi',
          fileName: format => {
            const fileName = 'adv-ui'
            if (format === 'es') {
              return `${fileName}.esm.js`
            }
            if (format === 'iife') {
              return `${fileName}.global.js`
            }
            return `${fileName}.${format}.js`
          },
        },
      },
      plugins,
    };

    const mergedConfig = mergeConfig(commonConfig(mode), applicationConfig);

    return mergeConfig(mergedConfig, overrides);
  });
}

async function createDefineData(root: string) {
  try {
    const pkgJson = await readPackageJSON(root);
    const { dependencies, devDependencies, name, version } = pkgJson;

    const __APP_INFO__ = {
      pkg: { dependencies, devDependencies, name, version },
      lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    return {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    };
  } catch (error) {
    return {};
  }
}

export { defineApplicationConfig };
