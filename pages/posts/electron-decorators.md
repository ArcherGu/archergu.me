---
title: 用装饰器给 Electron 提供一个基础框架
date: 2021-08-03T06:00:00.000+00:00
tags: ['Electron', '装饰器', '技术分享']
tagsColor: ['#74b1be', '#D0104C', '#268785']
duration: 10min
---

<blockquote>
前置知识：Electron 项目经验，ipcRenderer 通信。
</blockquote>

在我的一些项目中，Electron 经常作为产品的过渡阶段而使用，产品在初期选择 Electron 来构建一个前端后端集成在一起的客户端，当有 B/S 需求时将其拆分，去除 Electron，保留前端，然后提供一个传统的后端。所以，在这些项目中，Electron 的主进程将充当一个后端的角色，为渲染进程提供一系列用于调用的 api。同时，渲染进程的代码结构会和常规的 Web 前端的代码结构非常类似。

## 渲染进程 (前端部分)

常规的 Web 前端项目中，我们会提供一个 api 调用器，比如 [axios](https://axios-http.com/) 这样的 http 库。然后提供一个 `/api` 目录，将相关的接口存放在其中。Electron 中的渲染部分也是如此，只不过这里的 api 调用器被替换成了 [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer)。通过 ipcRenderer 渲染进程可以同步或异步的发送消息到主进程，也可以接收主进程回复的消息。我们可以开启 [nodeIntegration](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions) 在渲染进程直接调用<sup>[[不安全](https://www.electronjs.org/docs/latest/tutorial/security/#2-do-not-enable-nodejs-integration-for-remote-content)]</sup>：
```ts
const { ipcRenderer } = window.require('electron');
```
或者使用 [contextBridge](https://www.electronjs.org/docs/latest/tutorial/context-isolation) 将 ipcRenderer 挂载到 `window` 下以供渲染进程使用<sup>[[推荐](https://www.electronjs.org/docs/latest/tutorial/context-isolation)]</sup>。

为了让 ipcRenderer 更像一个 api 调用器，我们需要对其进行一些封装:
```ts
interface IpcResponse<T> {
    data?: T;
    error?: any;
}

async function ipcInvoke<T = any>(target: string, ...args: any[]) {
    const response: IpcResponse<T> = await ipcRenderer.invoke(target, ...args);
    if (response.hasOwnProperty('error')) {
        throw response;
    }

    return response;
}
```
api 封装:
```ts
export function sendMsgToMainProcess(msg: string) {
    return ipcInvoke<string>('send-msg', msg);
}

// 实际调用
const { data } = await sendMsgToMainProcess('Hi! Main Process!');
```

渲染进程的代码经过上述的封装后应该很接近常规 Web 项目的写法了，后续如果更换到 B/S 架构，只需要将 api 调用器进行更换就行了。

## 主进程 (后端部分)

施工中...