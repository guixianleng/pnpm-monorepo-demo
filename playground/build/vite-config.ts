import type { PluginOption } from 'vite';
import createAutoImport from './plugins/auto-import'
import createComponents from './plugins/components'
import createIcons from './plugins/icons'

async function createPlugins() {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    createAutoImport(),
    createComponents(),
  ];

  return vitePlugins;
}

export { createPlugins };