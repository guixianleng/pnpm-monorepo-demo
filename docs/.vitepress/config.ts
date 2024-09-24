import { defineConfig } from "vitepress"
import { mdPlugin } from "./config/plugins"

export default defineConfig({
  title: "TuiPlus基础组件文档",
  description: "基于Element-plus基础组件封装使用",
  // head: [
  //   ['link', { rel: 'icon', href: '/favicon.ico' }]
  // ],
  lang: "cn-ZH",
  base: "/adv-ui-plus/",
  lastUpdated: true,
  themeConfig: {
    logo: "/vite.svg",
    siteTitle: "组件库文档",
    outline: 3,
    socialLinks: [{ icon: "github", link: "https://github.com/wocwin/t-ui-plus" }],
    nav: [
      {
        text: "安装指南",
        link: "/components/"
      },
      { text: "基础组件", link: "/components/Button/base.md" },
    ],
    sidebar: {
      "/components": [
        {
          text: "常用组件",
          items: [
            { text: "Button组件", link: "/components/Button/base.md" },
          ]
        },
        {
          text: "复杂组件",
          items: []
        }
      ]
    }
  },
  markdown: {
    headers: {
      level: [0, 0]
    },
    // light: #f9fafb, dark: --vp-code-block-bg
    theme: { light: "github-light", dark: "github-dark" },
    config: md => mdPlugin(md)
  }
})
