import { resolve } from 'node:path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default () => {
  return createSvgIconsPlugin({
    iconDirs: [resolve(process.cwd(), "src/assets/icons")],
    symbolId: "icon-[dir]-[name]",
  })
}
