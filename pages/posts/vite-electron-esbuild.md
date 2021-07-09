---
title: 极速DX Vite + Electron + esbuild
date: 2021-07-09T06:00:00.000+00:00
tags: ['Vite', 'Electron', 'esbuild', '技术分享']
tagsColor: ['#ba38fe', '#74b1be', '#FFCF00', '#268785']
duration: 20min
---

<blockquote>
Vite 问世后，让我们体验到了极速的开发体验，由于我的好多项目需要用到 Electron，于是我就在想如何将 Vite 和 Electron 集成起来...
</blockquote>

## Vite 的背后

Vite 的基本原理大家应该都已经清楚了，基于原生 ESM 的开发服务，只需要在浏览器请求源码时进行转换并按需提供源码。除了这一点，Vite 还依赖于一个非常快速的 js bundler --- esbuild。
![native-esm-based-dev-server](https://cn.vitejs.dev/assets/esm.3070012d.png)

如果仅使用原生 ESM，实际上我们的许多依赖是没法使用的，它们大多数时候是按照 CommonJS 的格式开发，另外，当一个模块依赖另外一个模块时，浏览器会进行过多的请求，比如你引用 lodash 中的一个方法，结果它由引用了其他的文件，如此反复，浏览器为了获取这个方法可能要进行上百次的请求，所以 Vite 会通过 esbuild 对这些依赖进行整体的转换和打包，而 esbuild 是由 Go 编写，比传统的 js 编写的打包器要快很多。（大概如下图这么快）
![esbuild](/images/esbuild.png)

通过 esbuild 的快速预构建，让这些模块符合 ESM 格式，并且进行了捆绑，这样浏览器只需要少量的请求就可以获取到源码。

## 让 Electron 的构建也快起来

在开发模式下，前端部分我们可以用 Vite 快速启动服务，然后让 Electron 的主进程去加载对应的 localhost 地址。这里有一个问题，我们用什么来构建 Electron 呢？

首先要说明一点，我们在这里全部使用 Typescript 进行开发，无论是主进程还是渲染进程。所以 Electron 主进程代码的转换打包也是必不可少的。
正常情况下，主进程构建我们会用 <vscode-icons-file-type-webpack />webpack 来完成，然后在 node 环境下让主进程跑起来即可。就像 vue-cli 的项目可以用 [vue-cli-plugin-electron-builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/) 来完成 Electron 的快速集成，其背后也是基于 webpack.

实际上，当你打开 [awesome-vite](https://github.com/vitejs/awesome-vite) 时确实有几个 Vite + Electron 的项目模板，Electron 部分基本上是通过 <vscode-icons-file-type-rollup />rollup 进行转换打包，rollup 倒是也不错，整体速度也有所提升，甚至你还可以用 [rollup-plugin-esbuild](https://github.com/egoist/rollup-plugin-esbuild) 这样的插件集成 esbuild 的极速优势。但是我这里却遇到了一些麻烦，因为我的项目中在主进程部分使用了不少装饰器和元数据反射，所以在 `tsconfig.json` 中必须开启 [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators) 和 [`emitDecoratorMetadata`](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)，不幸的是，esbuild 不支持 `emitDecoratorMetadata`[<sup>[不支持]</sup>](https://esbuild.github.io/content-types/#typescript)，所以 rollup-plugin-esbuild 插件没法用了。我也尝试着不使用 esbuild，而使用 [@rollup/plugin-typescript](https://github.com/rollup/plugins/tree/master/packages/typescript)， 可是速度却降低了很多，特别是在项目大了以后。

## 抛弃 rollup

尽管 esbuild 暂时不支持 `emitDecoratorMetadata`，但是作者在 [issues#915](https://github.com/evanw/esbuild/issues/915#issuecomment-791904154) 给出了解决办法，即先判断一下 Typescript 文件中是否包含装饰器（利用正则表达式），如果包含装饰器，则使用 tsc 对这些文件处理，至于其他不包含装饰器的文件依然由 esbuild 来出来，这样可以说是目前最快速的方法。这确实是一个好思路，也许我也可以在 rollup 里这样做，写一个 rollup 插件，预先处理一下这些包含装饰器的文件...

等等 😓，为什么我一定要使用 rollup 来构建主进程？虽然 esbuild 在构建打包的功能还有待加强，特别是代码分割，CSS 处理方面[<sup>[待加强]</sup>](https://cn.vitejs.dev/guide/why.html#why-not-bundle-with-esbuild)，灵活性也没有 rollup 强，可是用来构建 Electron 主进程，这些东西其实都没有必要，我需要的只是将 Typescript 编写的代码进行转换，解析依赖，打包成 cjs 格式的代码即可，esbuild 完全可以胜任。现在只要解决 `emitDecoratorMetadata` 问题就行了，幸运的是，沿着上面的 issues 查找，我找到了对应的插件 [esbuild-decorators](https://github.com/anatine/esbuildnx/tree/main/packages/esbuild-decorators)，需要说明一下，目前 esbuild 的插件只能在 [build](https://esbuild.github.io/api/#build-api) 中使用，[transform](https://esbuild.github.io/api/#transform-api) 中不支持。

## 代码细节

现在整体的思路已经理清，可以开始编写构建脚本了。

### Vite 部分

前端部分其实不需要太大的修改，毕竟 Vite 都已经帮我们封装好了，唯一要做的也许只是目录结构的调整（你也可以不调整，看你的规范程度 😝），将前端的代码都放到 `src/render` 目录下，然后修改一下 vite.config.ts:

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';
import { join } from 'path';
dotenv.config({ path: join(__dirname, '.env') });

export default defineConfig({
    root: join(__dirname, 'src/render'), // 现在的 root 在 src/render 下了
    plugins: [vue()],
    resolve: {
        alias: {
            /* ...路径调整了，alias也需要对应的修改 */
        },
    },
    base: './',
    build: {
        outDir: join(__dirname, 'dist/render'), // 输出路径
        emptyOutDir: true,
    },
    server: {
        port: +process.env.PORT,
    },
});
```

### Electron 部分

重点是编写 Electron 主进程的构建脚本，这里我设置了 `src/main` 作为主进程代码的目录，`src/main/index.ts` 作为入口。构建脚本放置在 `script` 目录下。

以下是 esbuild 的一些配置选项:

```ts
// esbuild.options.ts
import { join } from 'path';
import { esbuildDecorators } from '@anatine/esbuild-decorators';
import { builtinModules } from 'module';
import { BuildOptions } from 'esbuild';

export function createOptions(): BuildOptions {
    return {
        entryPoints: [join(__dirname, '../src/main/index.ts')],
        outfile: join(__dirname, '../dist/main/index.js'),
        format: 'cjs',
        bundle: true,
        platform: 'node',
        plugins: [
            esbuildDecorators({
                tsconfig: join(__dirname, '../tsconfig.json'),
            }),
        ],
        external: [...builtinModules.filter((x) => !/^_|^(internal|v8|node-inspect)\/|\//.test(x)), 'electron'],
    };
}
```

构建脚本`build.ts`:

```ts
import { join } from 'path';
import dotenv from 'dotenv';
import { spawn, ChildProcess } from 'child_process';
import electron from 'electron';
import minimist from 'minimist';
import waitOn from 'wait-on';
import { build } from 'esbuild';
import { main } from '../package.json';
import { createOptions } from './esbuild.options';
dotenv.config({ path: join(__dirname, '../.env') });

const argv = minimist(process.argv.slice(2));
const options = createOptions();

const runApp = () => {
    return spawn(electron as any, [join(__dirname, `../${main}`)], { stdio: 'inherit' });
};

if (argv.watch) {
    waitOn(
        {
            resources: [`http://localhost:${process.env.PORT}/index.html`],
            timeout: 5000,
        },
        (err: any) => {
            if (err) {
                console.log(err);
                process.exit(1);
            } else {
                let child: ChildProcess;
                build({
                    ...options,
                    watch: {
                        onRebuild(error) {
                            if (error) {
                                console.error('Rebuild Failed:', error);
                            } else {
                                console.log('Rebuild Succeeded');
                                if (child) child.kill();
                                child = runApp();
                            }
                        },
                    },
                }).then(() => {
                    if (child) child.kill();
                    child = runApp();
                });
            }
        }
    );
} else {
    build(options)
        .then(() => {
            console.log('Electron Build Succeeded.');
        })
        .catch((error) => {
            console.log('Electron Build Failed\n', error, '\n');
        });
}
```

更多的代码细节可以查看我新建的模板项目 [fast-vite-electron](https://github.com/ArcherGu/fast-vite-electron)。

## ⚡ 极速 DX

随着前端工程化的进一步推进，我们不仅仅要提升 UX，对于自身来说 DX 也非常重要。项目越来越大，越来越复杂，整个构建过程的时间也越来越长。开玩笑地说，或许在上班时，还可以为我们提供一些摸鱼时间，但是当开发自己的项目时，我依然想进一步的压缩这些时间。第一次体验到 Vite 的时候，我真的惊呆了，居然可以做到如此迅速的开发启动。随着 esbuild, swc 这样的高效率语言开发的工具加入，这种极速的追求还将继续。
