# 总览

## 使用插件

你可以在 `rsbuild.config.ts` 中使用 `plugins` 选项来注册 Rsbuild 插件。

比如注册 Vue 插件：

```ts title="rsbuild.config.ts"
import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';

export default defineConfig({
  plugins: [pluginVue()],
});
```

## 官方插件

以下是 Rsbuild 官方提供的插件。

### [React 插件](/plugins/list/plugin-react.html)

提供对 React 的支持。

### [Vue 插件](/plugins/list/plugin-vue.html)

提供对 Vue 3 SFC（单文件组件）的支持。

### [Vue JSX 插件](/plugins/list/plugin-vue-jsx.html)

提供对 Vue 3 JSX / TSX 语法的支持。

### [Vue2 插件](/plugins/list/plugin-vue2.html)

提供对 Vue 2 SFC（单文件组件）的支持。

### [Vue2 JSX 插件](/plugins/list/plugin-vue2-jsx.html)

提供对 Vue 2 JSX / TSX 语法的支持。

### [Type Check 插件](/plugins/list/plugin-type-check.html)

用于在单独的进程中运行 TypeScript 类型检查。

### [Image Compress 插件](/plugins/list/plugin-image-compress.html)

将项目中用到的图片资源进行压缩处理。

### [Node Polyfill 插件](/plugins/list/plugin-node-polyfill.html)

用于注入 Node 核心模块在浏览器端的 polyfills。

### [Source Build 插件](/plugins/list/plugin-source-build.html)

用于 monorepo 场景，支持引用其他子目录的源代码，并完成构建和热更新。

### [Stylus 插件](/plugins/list/plugin-stylus.html)

使用 Stylus 作为 CSS 预处理器。
