import jiti from "file:///D:/Workspace/Project/my-local-demo/pnpm-monorepo-demo/node_modules/.pnpm/jiti@1.21.6/node_modules/jiti/lib/index.js";

/** @type {import("D:/Workspace/Project/my-local-demo/pnpm-monorepo-demo/internal/vite-config/src/index")} */
const _module = jiti(null, {
  "esmResolve": true,
  "interopDefault": true,
  "alias": {
    "@adv/vite-config": "D:/Workspace/Project/my-local-demo/pnpm-monorepo-demo/internal/vite-config"
  }
})("D:/Workspace/Project/my-local-demo/pnpm-monorepo-demo/internal/vite-config/src/index.ts");

export const defineApplicationConfig = _module.defineApplicationConfig;
export const definePackageConfig = _module.definePackageConfig;