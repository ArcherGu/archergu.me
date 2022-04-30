---
title: 用 Vite 构建静态网站
date: 2021-06-03T06:00:00.000+00:00
tags: ["Vite", "技术分享"]
tagsColor: ["#ba38fe", "#268785"]
duration: 20min
---

<blockquote>
前置知识：前端工程化 (Nodejs, npm...)，Vue.js (最好 >= 3.0)，TypeScript，基本的 markdown 编写能力。
</blockquote>

## 我们需要做什么？

我们的目标是构建一个静态网站，但是显然不是那种纯粹用 html 编写的页面，我们的网站在完成搭建后，后续只需要在 markdown 中大展才华，然后通过自动化的流程将 markdown 转换成静态的 html 页面，并为之生成相应的路由。所以这篇文章实际上将要介绍的是如何构建一个自动化的静态网站生成器，就像 [VuePress](https://vuepress.vuejs.org/), [Hexo](https://hexo.io/) 那样。

目标明确后，我们就需要列一下关键技术：

- 基于 <vscode-icons-file-type-vite /> [Vite.js](https://vitejs.dev/) 和 <vscode-icons-file-type-vue /> [Vue.js - 3.0](https://v3.vuejs.org/)，支持 <vscode-icons-file-type-typescript-official /> [TypeScript](https://www.typescriptlang.org/)
- 基于文件系统的 <tabler-route /> 路由
- 支持 <ri-markdown-line /> Markdown 组件, 可以在 Markdown 中使用 Vue 组件
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
import { defineConfig } from 'vite'
import ViteVue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    ViteVue({
      include: [/\.vue$/, /\.md$/],
    }),
  ],
})
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
import { resolve } from 'path'
import VitePages from 'vite-plugin-pages'
import fs from 'fs-extra'
import matter from 'gray-matter'

// plugins settings
export default defineConfig({
  plugins: [
    // ...
    VitePages({
      extensions: ['vue', 'md'],
      pagesDir: 'pages',
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))
        const md = fs.readFileSync(path, 'utf-8')
        const { data } = matter(md)
        route.meta = Object.assign(route.meta || {}, { frontmatter: data })

        return route
      },
    }),
  ],
})
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
import { createApp } from 'vue'
import routes from 'pages-generated' // vite-plugin-pages 生成的路由信息
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const app = createApp(App)
app.use(
  createRouter({
    history: createWebHistory(),
    routes,
  })
)

app.mount('#app')
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

## 支持 Markdown

完成上面的 vite-plugin-pages 插件配置后，也许你尝试在 `pages` 目录下创建一个 `.md` 文件的页面，但是却发现尽管路由生成了，但是页面却无法显示，因为目前这个静态网站生成器还缺少 markdown 的支持。

<code>[vite-plugin-md](https://github.com/antfu/vite-plugin-md)</code> 为 Vite 提供了将 markdown 当作 Vue 组件使用的功能，也可以在 markdown 中使用 Vue 组件。安装该插件：

```bash
$ npm i vite-plugin-md -D
```

然后配置一下:

```ts
// vite.config.ts (以下为该插件的配置，不包括其他插件的配置)
// ...
import ViteMarkdown from 'vite-plugin-md'

// plugins settings
export default defineConfig({
  plugins: [
    // ...
    ViteMarkdown(),
  ],
})
```

现在我们就可以在 `pages` 目录下创建一个 `bar.md` 来尝试一下了：

```md
<!-- pages/bar.md -->

# Hi, Markdown

This is a markdown page.
```

重启项目后，在浏览器地址栏里添加 `/bar`，就可以看到这个 markdown 页面了。

不是说还可以在 markdown 文件中使用 Vue 组件吗？那么现在，在`src/components` 下建立一个 Vue 组件，比如叫 `MyComponent.vue`：

```html
<!-- src/components/MyComponent.vue -->
<template>
  <div>This is a Vue component.</div>
</template>
```

然后我们把该组件加入到 `pages/bar.md` 中:

```diff
<!-- pages/bar.md -->

# Hi, Markdown

This is a markdown page.

+ <MyComponent />
```

重启项目，什么都没有发生 😅。这是因为 markdown 中我们没法像 js/ts 那样将组件 import 进来，所以除非这个组件被全局注册，否则无法直接使用。

这里又有一个 <code>[vite-plugin-components](https://github.com/antfu/vite-plugin-md)</code> 插件可以帮我们解决问题，这个插件提供了组件自动导入功能（ vite-plugin-md 实际上是对 markdown 进行了 html 转换处理，所以在 markdown 中使用了组件，也可以获得 vite-plugin-components 的支持）。配置一下插件：

```ts
// vite.config.ts (以下为该插件的配置，不包括其他插件的配置)
// ...
import ViteComponents from 'vite-plugin-components'

// plugins settings
export default defineConfig({
  plugins: [
    // ...
    ViteComponents({
      extensions: ['vue', 'md'],
      customLoaderMatcher: path => path.endsWith('.md'),
    }),
  ],
})
```

重启项目，此时 `MyComponent` 组件已经正确的显示了！

~~支持 <ri-markdown-line /> Markdown 组件, 可以在 Markdown 中使用 Vue 组件~~

## 静态页面生成

完成上面的 Vite 插件配置后其实已经是一个具有基本功能的网站了，你完全可以按照常规的开发模式来构建自己的页面。但是这里我们还需要完成静态页面的生成，这样当你创作内容并发布后，搜索引擎也许会记录到一些信息（SEO 优化）。

[Anthony Fu](https://github.com/antfu) 大佬为我们提供了一个静态页面生成器（SSG，server-side generation）—— [vite-ssg](https://github.com/antfu/vite-ssg)。使用这个工具，我们可以在 `build` 项目时将页面打包成一个个的静态页面。

安装 vite-ssg：

```bash
$ npm install vite-ssg -D
# 使用 vite-ssg 需要的依赖
$ npm install @vueuse/head -S
$ npm install @vue/server-renderer -D
```

接下来，我们修改一下项目的入口文件 `main.ts`：

```ts
// src/main.ts
import routes from 'pages-generated'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'

// `export const createApp` is required
export const createApp = ViteSSG(App, { routes })
```

然后我们也需要修改一下 `package.json` 中的 `scripts`：

```diff
  "scripts": {
    "dev": "vite",
-   "build": "vue-tsc --noEmit && vite build",
+   "build": "vite-ssg build",
    "serve": "vite preview"
  },
```

用 `dev` 模式重启一下项目，应该没有啥问题。然后我们执行下 `build`：

```bash
$ npm run build
```

项目自动进行打包，输出目录默认是根目录下的 `dist` 文件夹。你会发现，这个打包的结果和常规的 vue-cli 或者 Vite 项目打包的结果不同，它将页面都转换成了的 `.html` 静态页面文件。这样我们在部署网站时，搜索引擎将尽可能的收集我们创作的内容。

~~纯粹的 <bx-bxs-file-html /> 静态页面，支持 <uil-server /> 服务端生成~~

## 最后说的话

这是一个基础的 Vite 静态页面生成器，我们可以利用它来构建各种有趣的项目，你可以在 <code>[vite-static-site](https://github.com/ArcherGu/vite-static-site)</code> 找到本文所记录的源码。

它的整体思路都来自于 [Anthony Fu](https://github.com/antfu) 的 <code>[antfu.me](https://github.com/antfu/antfu.me)</code> 和 <code>[vitesse](https://github.com/antfu/vitesse)</code>。实际上前文提到的大部分插件和工具都是 Anthony Fu 创造并维护的，感谢他为我们带来了这些有趣的项目。🎉

> [知乎文章链接](https://zhuanlan.zhihu.com/p/377593594)
