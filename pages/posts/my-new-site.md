---
title: 我的新网站
date: 2021-06-01T14:00:00.000+00:00
badge: Launch
badgeColor: "#70649A"
duration: 2min
subtitle: Archer's new house
---

Hi！我是顾不上 (Archer Gu)，这是我的新网站。

实际上在此之前我有一个基于 <uil-wordpress /> [WordPress](https://wordpress.com/) 的小型网站，它被部署在我的腾讯云上。一开始我还使用这个云服务器进行一些学习工作，后来它被渐渐的闲置，唯一在上面使用的服务也就剩下了这个网站（我已经很久没有 ssh 到服务器上去了）。随着服务器时间的到期，我暂时不考虑续费了。尽管 WordPress 可以满足我的大部分需求，但是我仍然希望有一个更加 **轻便的**，**自由定制的**，**静态的** 个人网站。

今年初的时候我开始寻找一个适合我需求的静态网站框架，由于我最常用的前端技术栈是 <vscode-icons-file-type-vue /> [Vue.js](https://v3.vuejs.org/)，自然而然，[VuePress](https://vuepress.vuejs.org/) 进入了我的视线，但是我依然无法接受它，不是说 VuePress 存在什么缺点，相反的，VuePress 是一个非常不错的静态网站生成器，它默认提供了文档和博客的模板主题，你只需要专注于 <ri-markdown-line /> Markdown 的内容创作，VuePress 将自动根据你的 md 文件生成页面和路由。但是，作为一个爱折腾的人，VuePress 没法满足我对 **自由** 的追求。

去年 <vscode-icons-file-type-vite /> [Vite.js](https://vitejs.dev/) 横空出世，让我们体验到了极致的 ⚡ 开发速度，于是我将目光转向了 VuePress 的兄弟 -- [VitePress](https://vitepress.vuejs.org/)。可惜，VitePress 目前依然处于 WIP 阶段，我不得不暂时放弃它。看上去用现成的框架来构建这个网站总是会有各种没法满足我需求的地方。

于是，我就问我自己，你需要什么样的个人网站？让我来列一下：

- 基于 <vscode-icons-file-type-vite /> [Vite.js](https://vitejs.dev/) 和 <vscode-icons-file-type-vue /> [Vue.js - 3.0](https://v3.vuejs.org/)，支持 <vscode-icons-file-type-typescript-official /> [TypeScript](https://www.typescriptlang.org/)
- 基于文件系统的 <tabler-route /> 路由
- 支持 <ri-markdown-line /> Markdown, 可以在 Markdown 中使用 Vue 组件
- 纯粹的 <bx-bxs-file-html /> 静态页面，支持 <uil-server /> 服务端生成

上面这些是这个网站必须具备的要素。总的来说就是利用常规前端框架来搭建一个博客系统，这样一切都可以由我掌控了！

具体的搭建过程我也许会另外写一篇文章来详细说明。实际上，在整个寻找的过程中，我发现已经有大佬这样做了。[Anthony Fu](https://github.com/antfu) 的个人网站 <code>[antfu.me](https://antfu.me/)</code> 即是用这样的思路构建，这让我省了不少时间（😊 又可以白嫖不少轮子了～）。

在接下来的时间里，我会将过去的一些文章资料慢慢的整理到这里来，当然，我也会写新的文章，分享更多的信息。

欢迎你的光临！非常感谢！👋
