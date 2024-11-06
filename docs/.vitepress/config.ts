import { defineConfig } from "vitepress"
import { mdPlugin } from "./config/plugins"

export default defineConfig({
  title: "组件库文档",
  description: "基于Element-plus基础组件封装使用",
  head: [
    ['link', { rel: 'icon', href: '/vite.svg' }]
  ],
  lang: "cn-ZH",
  base: "/pnpm-monorepo-demo/",
  lastUpdated: true,
  themeConfig: {
    logo: "/vite.svg",
    siteTitle: "组件库文档",
    outline: 3,
    socialLinks: [{ icon: "github", link: "https://github.com/guixianleng/pnpm-monorepo-demo" }],
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
        }
      ]
    }
  },
  markdown: {
    headers: {
      level: [0, 0]
    },
    theme: { light: "github-light", dark: "github-dark" },
    config: md => mdPlugin(md)
  }
})
