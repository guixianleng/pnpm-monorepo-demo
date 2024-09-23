# 组件库

## 介绍

> 基于 vue3+ ts+ Element-plus 二次封装组件


## npm 方式安装使用

```shell
pnpm i adv-ui
```

## Volar 组件类型提示

```js
// 需要在使用的项目的tsconfig.json文件中添加以下
compilerOptions：{
  "types": [
      "adv-ui/global.d.ts",
    ],
}

```

## 安装依赖
> ### 注意: 本地环境版本最好安装 [Node.js 16.x+](https://nodejs.org/en)、[pnpm 7.x+](https://github.com/pnpm/pnpm/)

```shell
npm install -g pnpm

pnpm install

```

## 本地运行 vuepress 中组件文档

```shell
// docs项目(文档demo示例)基于vue3+vite项目
npm run docs:dev

```

## Git 提交规范

- `ci`: ci 配置文件和脚本的变动;
- `chore`: 构建系统或辅助工具的变动;
- `fix`: 代码 BUG 修复;
- `feat`: 新功能;
- `perf`: 性能优化和提升;
- `refactor`: 仅仅是代码变动，既不是修复 BUG 也不是引入新功能;
- `style`: 代码格式调整，可能是空格、分号、缩进等等;
- `docs`: 文档变动;
- `test`: 补充缺失的测试用例或者修正现有的测试用例;
- `revert`: 回滚操作;

## 遇到的问题

- pnpm i @adv/components -F @adv/demo 

  - 问题描述：
  执行后，通过npm市场安装依赖包，明显错误
  - 解决办法：
  首先需要在.npmrc中注入： `ignore-workspace-root-check=true`