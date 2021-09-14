---
title: 当 Electron 遇到 Nest.JS
date: 2021-09-13T08:00:00.000+00:00
tags: ['Electron', 'Nest.js', '技术分享']
tagsColor: ['#74b1be', '#e0234e', '#268785']
duration: 30min
---

<blockquote>
前置知识：熟悉 Typescript，有 Electron 项目，Nest.js 项目的经验。
</blockquote>

在之前的文章[《用装饰器给 Electron 提供一个基础 API 框架》](https://archergu.me/posts/electron-decorators)中，介绍了通过装饰器来加强 Electron 主进程的代码框架，使得其像一个后端框架那样来对各个模块进行功能安排。文章的最后，我也提到了我的一个项目模板: [fast-vite-nestjs-electron](https://github.com/ArcherGu/fast-vite-nestjs-electron)，这个模板集成了当前流行的nodejs后端框架 <vscode-icons-file-type-nestjs /> [Nest.js](https://nestjs.com/)，如果未来我们的 C/S 应用要转换为 B/S 应用时，可以快速通过这种架构模式将它们进行分离。这篇文章将介绍 Electron 主进程和 Nest.js 的集成过程。

## 项目结构

项目结构其实和[《用装饰器给 Electron 提供一个基础 API 框架》](https://archergu.me/posts/electron-decorators)中使用的项目模板 [fast-vite-electron](https://github.com/ArcherGu/fast-vite-electron) 一样，`src/render`目录存放渲染进程的代码，为了快速的开发体验，我们依然是选择 <vscode-icons-file-type-vite /> [Vite.js](https://vitejs.dev/) 来构建前端部分。`script` 目录用于存放主进程的构建脚本，我们还是要快速，所以选择了 <logos-esbuild /> [esbuild](https://esbuild.github.io/) 来构建。另外就是一些根路径下的配置性文件，当然，这些不是本文的重点，这里不作过多介绍，感兴趣的朋友可以阅读之前的文章[《极速DX Vite + Electron + esbuild》](https://archergu.me/posts/vite-electron-esbuild)。

`src/main` 目录用于存放 Electron 主进程的代码，这里是本文的**重点**。虽然看上去这将会是一个 Electron 应用，但是实际上，我的集成方案里是将 Electron 集成到 Nest.js 中，所以这个目录的内部结构和 Nest.js 项目的目录机构一样，一个 `index.ts` 文件作为框架的启动入口，内部的子目录都是 Nest.js 的各个 modules。

```bash
src
├─main # electron 主进程目录
│  ├─global # 全局模块
│  ├─transport # electron ipc 转换器
│  ├─app.module.ts  # 默认的 app module，包含一个 controller 和 service
│  ├─app.controller.ts
│  ├─app.service.ts
│  └─index.ts # 启动入口
│ 
└─render # vite 构建的前端目录
    ├─api
    ├─assets
    ├─components
    ├─plugins
    └─public
```

## 用 Nest.js 启动 Electron

上面说到，我的集成方案里是将 Electron 集成到 Nest.js 中，所以应用的启动也和 Nest.js 一样，下面是 Nest.js 文档中的默认启动方法:
```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```
在一个 `bootstrap` 方法中，创建一个实例，然后监听某个端口，当然这是 Nest.js 作为后端框架的常规启动方式，默认情况[<sup>[1]</sup>](#refer-1)下内部其实是启动了一个 [Express](https://expressjs.com/)。不过我们和前端的通信可不是 HTTP 而是通过 Electron 的 IPC，所以需要换一种方式来创建实例。

## Electron Ipc 的传输器

除了传统的应用程序架构之外，Nest.js 还支持微服务架构风格的开发。Nest.js 的依赖项注入、装饰器、异常过滤器、管道、保护和拦截器同样适用于微服务。而且其微服务还支持自定义的传输器，可以方便的让我们实现一个基于 Electron IPC 的传输器，用于和渲染进程进行 Nest.js 风格的通信。

根据文档[<sup>[2]</sup>](#refer-2)，这个传输器需要继承 `@nestjs/microservices` 的 `Server`，实现 `CustomTransportStrategy`:
```ts
export class ElectronIpcTransport extends Server implements CustomTransportStrategy {
    listen(callback: () => void): any {
        callback();
    }

    close(): any { }
}
```
- `listen` 方法会在 `app.listen()` 时调用，我们可以在这个方法里把各个请求的方法注册到 IPC 通道上。
- `close` 方法则在应用销毁时调用。

请求方法的绑定我们还是需要借助装饰器:
```ts
export function IpcInvoke(messageChannel: string) {
    ipcMain.handle(messageChannel, (...args) => ipcMessageDispatcher.emit(messageChannel, ...args));

    return applyDecorators(
        MessagePattern(messageChannel),
    );
}
```
上面这个方法是一个装饰器构造器，其中出现了一些莫名的东西: 

首先是 `ipcMessageDispatcher` 这个是一个 `EventEmitter`，主要是为了简化我们代码的结构。而 `ipcMain.handle`，就是一个 Electron IPC 的常规操作，将事件和具体的处理方法进行绑定，当渲染进程触发这个事件时，主进程用对应的方法进行处理。`ipcMessageDispatcher` 的内部实现下文中将进行介绍，这里你只要知道，当渲染进程触发某个 IPC 的事件名时，都会被 `ipcMessageDispatcher.emit` 到某个黑箱中进行处理，我们会在黑箱中对这些事件进行分发，交由具体的方法进行处理。

接下来是返回具体的装饰器，`applyDecorators` 可以将多个装饰器组合在一起，形成一个新的装饰器，目前就一个装饰器 `MessagePattern`。这个装饰器用于将事件名和装饰器具体装饰的方法进行绑定，并在某个地方进行注册，后续我们会在那个黑箱中用到它。

这个自定义装饰器 `IpcInvoke` 可以像 Nest.js 的那些 `@Get(), @Post()` 那样放在 `Controller` 的成员方法上，将事件名和方法注册到 IPC 通道上:
```ts
@Controller()
export class AppController {
    constructor() { }

    @IpcInvoke('msg')
    public async handleSendMsg(msg: string): Promise<string> {
        return `The main process received your message: ${msg}`;
    }
}
```

现在我们来说说这个 `ipcMessageDispatcher`:
```ts
class IPCMessageDispatcher extends EventEmitter {
    // @ts-ignore
    async emit(messageChannel: string, ...args: any[]): Promise<any> {
        const [ipcHandler] = this.listeners('ipc-message');

        if (ipcHandler) {
            return Reflect.apply(ipcHandler, this, [messageChannel, ...args]);
        }
    }
}
```
它的 `emit` 方法内，获取了监听 "ipc-message" 事件名的方法 `ipcHandler`，然后将 IPC 用到的事件名 `messageChannel` 和相关的参数用这个 `ipcHandler` 进行处理。（`Reflect.apply`：通过指定的参数列表发起对目标函数的调用[<sup>[3]</sup>](#refer-3)）。所以，当渲染进程触发 IPC 事件时，`ipcMessageDispatcher` 会将对应的事件名和相关的参数（如果有的话），统一交给监听了 "ipc-message" 事件的 `ipcHandler` 处理，这个 `ipcHandler` 就是我们上面说到的黑箱。下面，将揭开这个黑箱的真面目。

首先，我们在传输器的 `listen` 方法中加点东西:
```ts
listen(callback: () => void): any {
    ipcMessageDispatcher.on('ipc-message', this.onMessage.bind(this));
    callback();
}
```
`ipcMessageDispatcher` 监听了一个 “ipc-message” 事件，就是上面 `emit` 中获取 `ipcHandler` 这个监听者时所查询的事件名，`ipcHandler`就是传输器的自定义方法 `onMessage`，这个 `onMessage` 是一个总的调度器，用于对 IPC 的事件进行分发。下面是 `onMessage` 方法的实现:
```ts
export class ElectronIpcTransport extends Server implements CustomTransportStrategy {
    async onMessage(messageChannel: string, ...args: any[]): Promise<any> {
        const handler: MessageHandler | undefined = this.messageHandlers.get(messageChannel);
        if (!handler) return;

        const [ipcMainEventObject, payload] = args;
        const data = (!payload || payload.length === 0) ? undefined : payload.length === 1 ? payload[0] : payload;

        const result = await handler(data, {
            evt: ipcMainEventObject,
        });

        return {
            data: result,
        };
    }
}
```
`this.messageHandlers` 就是上面 `MessagePattern` 装饰器注册事件和处理方法的地方，我们通过 IPC 的事件名 `messageChannel` 获取到
对应的处理方法 `handler`。有了 `handler` 后，就是调用它，然后返回结果，这个和常规的 IPC 调用一样。

这就是整个 Electron IPC 传输器的逻辑，在实现的过程中我参考了 [nestjs-electron-ipc-transport](https://github.com/NimitzDEV/nestjs-electron-ipc-transport) 这个库，非常感谢作者 [NimitzDEV](https://github.com/NimitzDEV) 提供的方案。

## 创建实例和 window 模块

未完待续


## References

<div id="refer-1">

- [1] [Nest.js Documentation - Platform](https://docs.nestjs.com/first-steps#platform)

</div>

<div id="refer-2">

- [2] [Nest.js Documentation - Custom transporters](https://docs.nestjs.com/microservices/custom-transport)

</div>

<div id="refer-3">

- [3] [MDN - Reflect.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply)

</div>