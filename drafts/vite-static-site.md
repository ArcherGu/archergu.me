---
title: 用 Vite 构建静态网站
date: 2021-06-02T06:00:00.000+00:00
tags: ["Vite"]
tagsColor: ["#ba38fe"]
duration: 20min
---

这篇文章主要将介绍本网站的构成。从标题看这似乎是一篇教程文章，实际上我觉得它更像是一篇源码分析类的文章。

就像 [我的新网站](/posts/my-new-site) 中说的，[Anthony Fu](https://github.com/antfu) 大佬的个人网站项目给了我很多指引。

所以这篇文章更应该看作是对 [antfu.me](https://antfu.me/) 这个网站的解读。在这里再次感谢 [Anthony Fu](https://github.com/antfu) 为我们带来了众多有意思的项目 🎉。

<blockquote>
前置知识：前端工程化 (Nodejs, npm...)，Vue.js (最好 >= 3.0)，TypeScript，基本的 markdown 编写能力。
</blockquote>

## 我们需要做什么？

我们的目标是构建一个静态网站，但是显然不是那种纯粹用 html 编写的页面，我们的网站在完成搭建后，后续只需要在 markdown 中大展才华，然后通过自动化的流程将 markdown 转换成静态的 html 页面，并为之生成相应的路由。所以这篇文章实际上将要介绍的是如何构建一个自动化的静态网站生成器，就像 [VuePress](https://vuepress.vuejs.org/), [Hexo](https://hexo.io/) 那样。

目标明确后，我们就需要列一下关键技术：

- 基于 <vscode-icons-file-type-vite /> [Vite.js](https://vitejs.dev/) 和 <vscode-icons-file-type-vue /> [Vue.js - 3.0](https://v3.vuejs.org/)，支持 <vscode-icons-file-type-typescript-official /> [TypeScript](https://www.typescriptlang.org/)
- 基于文件系统的 <tabler-route /> 路由
- 支持 <ri-markdown-line /> Markdown, 可以在 Markdown 中使用 Vue 组件
- 纯粹的 <bx-bxs-file-html /> 静态页面，支持 <uil-server /> 服务端生成

后面我就对上面的技术点进行说明，在此过程中也会穿插一些细节内容。

## 生成一个 Vite 项目

Vite 是 2020 年 [Evan You](https://github.com/yyx990803) 为我们带来的一个下一代前端开发与构建工具。这里不会详细的介绍 Vite ，感兴趣的朋友可以阅读其 [官方文档](https://vitejs.dev/)。我对 Vite 的感觉，就是一个字 —— **快** ⚡，真的是非常快啊啊啊 🚀。

生成一个 Vite 项目（ Node.js 版本 >= 12.0.0）:

```bash
$ npm init @vitejs/app vite-static-site
```

根据命令行的提示，我们选择 Vue 框架，用 TypeScript 开发。然后进入项目目录，安装依赖。

就像你用 [vue-cli](https://cli.vuejs.org/) 构建的 Vue 项目一样，项目源码都被放置在`src`目录下，入口同样是`main.ts`文件。而框架的配置文件则由`vue.config.js`换成了`vite.config.ts`。此时这只是一个简单的 Vue 项目（只是把构建器从 Webpack 换成了 Vite），距离我们的目标还相去甚远。接下来我们需要安装各种 <code>[vite-plugin-\*](https://github.com/vitejs/awesome-vite#plugins)</code>，即 Vite 的插件，插件将在`vite.config.ts`中配置。

因为这是一个基于 Vite 的 Vue 项目，所以我们先把 <code>[@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)</code> 配置好，该插件为 Vite 提供了 Vue3 的 SFC 支持（由于刚才生成项目的时候选择了 Vue 作为开发框架，所以该插件无需手动安装）。

```ts
// vite.config.ts
import { defineConfig } from "vite";
import ViteVue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    ViteVue({
      include: [/\.vue$/, /\.md$/],
    }),
  ],
});
```

~~基于 <vscode-icons-file-type-vite /> [Vite.js](https://vitejs.dev/) 和 <vscode-icons-file-type-vue /> [Vue.js - 3.0](https://v3.vuejs.org/)，支持 <vscode-icons-file-type-typescript-official /> [TypeScript](https://www.typescriptlang.org/)~~

## 文件路由

什么是文件路由？确切的说应该是**基于文件系统的路由（file system based routing）**。因为网站搭建后，通常情况下我们只需要写写 markdown，或者`.vue`页面就可以自动生成路由，而访问者只要访问具体的路由，即可访问对应文件包含的内容了，这样做我们就不用像传统 Vue 项目开发那样在 vue-router 中配置专门的路由映射。

<code>[vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)</code> 插件为我们提供了这样的功能，安装该插件:

```bash
# 该插件还是需要vue-router提供支持的
$ npm install vite-plugin-pages -D
$ npm install vue-router@next

# 配置该插件需要用到的辅助库
$ npm install @types/fs-extra @types/node fs-extra gray-matter -D
```

接下来我们来完成 vite-plugin-pages 的配置：

```ts
// vite.config.ts (以下为该插件的配置，不包括其他插件的配置)
// ...
import VitePages from "vite-plugin-pages";
import { resolve } from "path";
import fs from "fs-extra";
import matter from "gray-matter";

// plugins settings
VitePages({
  extensions: ["vue", "md"],
  pagesDir: "pages",
  extendRoute(route) {
    const path = resolve(__dirname, route.component.slice(1));
    const md = fs.readFileSync(path, "utf-8");
    const { data } = matter(md);
    route.meta = Object.assign(route.meta || {}, { frontmatter: data });

    return route;
  },
}),
```

- `extensions`：需要包含的文件类型，这里显然是 `.vue` 和 `.md` 文件。
- `pagesDir`：寻找文件的目录，这里选择了项目根目录下的 `pages` 目录。
- `extendRoute`：提供一个方法，对每个文件产生路由做一些加工，这里是对 `route.meta` 的处理。
- `matter`：<code>[gray-matter](https://github.com/jonschlinkert/gray-matter)</code> 的功能，可以获取相关文件中的 `front-matter`，并将其处理为一个对象。
- `front-matter`：markdown 文件顶部，由 `---` 包裹的一块区域，就像：
  ```md
  ---
  title: Hello
  date: 2021-06-02
  ---
  ```

总结就是，vite-plugin-pages 会自动把 `pages` 目录中的 `.vue` 和 `.md` 文件生成对应的路由，并且我们可以利用 markdown 的 `front-matter` 来为路由提供一些额外信息。

然后我们来修改一下项目中的一些文件，让它们的功能和结构符合当前的插件配置。

为了让路由在 app 中生效，我们需要创建一个`router`，并让 app use 。修改 `src/main.ts`：

```ts
// src/main.ts
import App from "./App.vue";
import { createApp } from "vue";
import routes from "pages-generated"; // vite-plugin-pages 生成的路由信息
import { createRouter, createWebHistory } from "vue-router";

const app = createApp(App);
app.use(
  createRouter({
    history: createWebHistory(),
    routes,
  })
);

app.mount("#app");
```

<blockquote>
Note: 在 TS 中，直接从 `pages-generated` 导入会引起类型错误，需要在 `tsconfig.json` 的 `compilerOptions.types` 数组中加入 `vite-plugin-pages/client` 来加载对应的声明文件。
</blockquote>

`App.vue` 文件也需要进行修改，我们可以删除自动生成的所有代码，然后添加一个简单:

```html
<!-- src/App.vue -->
<template>
  <router-view />
</template>
```

还缺少一些页面，我们在项目根目录下创建 `pages` 文件夹，并在里面创建一个 `index.vue` 文件作为 homepage，再创建一个 `foo.vue` 作为测试页面：

```html
<!-- pages/index.vue -->
<template>
  <div>Hello, Vite</div>
</template>

<!-- pages/foo.vue -->
<template>
  <div>foo</div>
</template>
```

上面的这些操作其实就和我们构建一个常规的 Vue 项目一样。现在我们可以运行一下网站：

```bash
$ npm run dev
```

你可以在浏览器中看到我们设置的首页。在地址栏中添加 `/foo` 可以跳转到 foo 页面。

~~基于文件系统的 <tabler-route /> 路由~~
