import DefaultTheme from "vitepress/theme"

import TVHtml from "../components/TVHtml.vue"
import TIcon from "../components/TIcon.vue"
import TTip from "../components/TTip.vue"
import { VPDemo } from "../vitepress"
import "../../public/css/index.css"

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    
    ctx.app.component("Demo", VPDemo)
    ctx.app.component("TVHtml", TVHtml)
    ctx.app.component("TIcon", TIcon)
    ctx.app.component("TTip", TTip)
  }
}
