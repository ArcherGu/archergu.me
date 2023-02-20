---
title: 限制 ViteDevServer 的请求速度
date: 2023-02-20T02:00:00.000+00:00
tags: ['Vite', 'Nodejs', 'Stream', '技术分享']
tagsColor: ['#ba38fe', '#43853d', '#DB4D6D', '#268785']
duration: 20min
---

<blockquote>
在 Vite 的开发模式下，会启动一个 ViteDevServer, 其本质是一个 connect 服务。Vite 利用 ESM 的特性，前端在需要什么文件时就将请求发送给 ViteDevServer，它会将文件按照需要进行转换（或者不转换）返回给前端
</blockquote>

## 起因

最近在做一个 WebGL 的项目，需要加载一些模型文件到三维场景中。模型文件的体积通常比较大，所以会有一定的加载时间，我们常规的做法肯定是在这个加载过程中显示一个类似于进度条一样的东西来告知用户正在加载中。显然，这个进度条也成为了开发需求的一部分。

通常来说，这种进度条的开发，因为 Dev Server 运行在本地的原因，文件加载速度非常快，不方便进行调试，所以我们会在前端模拟一个缓慢加载的过程，比如让进度条永久显示，然后设置一个定时器，每隔一段时间就更新一下进度条的进度，接着慢慢调整进度条的样式和一些交互需求。这种方式的缺点是，进度条和文件的加载时间没有真正意义上的关联，我们最终需要在这部分开发完成后移除这些模拟代码。

为了减少这些模拟代码的增删，这次我想直接在 Dev Server 上进行限流，让文件请求的速度变慢，这样就可以真实的模拟文件加载的过程了。

因为我目前正在使用 <vscode-icons-file-type-vite /> Vite，所以这里就以 Vite 为例，来实现一个限制 ViteDevServer 请求速度的插件。

## 原理

其实这个过程的原理很简单，因为目前前端使用的大多数 Dev Server 都是一个 nodejs 的后端服务，就比如 ViteDevServer，它实际上就是一个 [connect](https://github.com/senchalabs/connect) 服务。而请求响应的过程，本质上就是一个 [Stream](https://nodejs.org/api/stream.html) 的过程，所以我们只需要在这个过程中加入一个限流的操作就可以了。

这里我们以静态文件的请求为例（通常情况下，这些静态文件不需要做额外的转换处理，直接返回给前端）。当前端向 ViteDevServer 发送一个请求获取某个文件时，后端会从目录中读取文件（一个文件读取流），接着向 response 中写入数据（一个可写流），发送给前端。我们的目标就是在这个写入过程中增加一个限流的操作。

![stream-throttle](/images/vite-rate-limiter-1.jpg)

这个限流操作，我们可以用常见的 throttle（节流）来实现。很幸运，这部分的实现已经有现成的库可以使用了，[stream-throttle](https://www.npmjs.com/package/stream-throttle)。它实际上是一个 [Transform Stream](https://nodejs.org/api/stream.html#stream_class_stream_transform)，在外部流经过它时，它会在内部进行限流操作，然后将限流后的数据流向下一级。

## 实现

弄清楚了原理，就可以开始实现了。Vite 的插件部分为我们提供了一个 [configureServer](https://vitejs.dev/guide/api-plugin.html#configureserver) 的钩子，可以对 ViteDevServer 进行一些配置，比如添加中间件。它的函数签名如下：

```ts
configureServer?: (server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>
```

我们可以在这个钩子中，通过 `server.middlewares.use` 添加一个限流中间件。

```ts
configureServer(server) {
  server.middlewares.use((req, res, next) => {
    // 限流中间件
  })
}
```
为了将 throttle “插入”到文件读取流和 response 写入流之间，我们需要做一个“偷梁换柱”的操作，即将原本的 response 的 write/end/on 方法替换成 throttle 的 write/end/on 方法，然后在数据通过 throttle 后才真正写入到 response 中。

```ts
const throttle = new Throttle({ rate: 100 * 1024 }) // 100kb/s
const { end: resEnd, write: resWrite, on: resOn } = res

// replace res.write/end/on
res.write = function (...args) {
  return throttle.write.apply(throttle, args)
}
res.end = function (...args) {
  return throttle.end.apply(throttle, args)
}
res.on = function (type, listener) {
  if (type !== 'drain')
    resOn.call(this, type, listener)
  else
    throttle.on(type, listener)
  return this
}

// end
throttle.on('end', () => resEnd.call(res))

// backpressure
throttle.on('data', (chunk) => resWrite.call(res, chunk) === false && throttle.pause())
resOn.call(res, 'drain', () => throttle.resume())
```
上述代码中:
- 创建一个 throttle 的 Transform Stream，用于限制速度，比如这里限制为 100kb/s。
- 将原生 res 的 write/end/on 方法暂存起来：resWrite, resEnd, resOn。
- 替换 res.write 方法，当文件流写数据调用 res.write 时实际上是写入到 throttle 中。
- 替换 res.end 方法，当文件流结束调用 res.end 时实际上是调用 throttle.end。
- 替换 res.on 方法，当文件流处理背压时，监听 response 的 drain 事件时，实际上是监听 throttle 的 drain 事件。
- 监听 throttle 的 end 事件，当 throttle 结束时，调用原生的 res.end，真正结束 response。
- 背压（backpressure）处理：
  - 监听 throttle 的 data 事件，当 throttle 写入数据时，调用原生的 res.write，将数据写入到 response 中，同时判断 res.write 的返回值，如果返回 false，说明 response 的缓冲区已满，需要暂停 throttle 向 response 的写入。
  - 监听 response 的 drain 事件，当 response 的缓冲区清空时，会触发此事件，此时需要调用 throttle.resume，继续向 response 写入数据。

这里的“偷梁换柱”，替换 res 的一些方法的过程应该比较容易理解，主要是要理解背压处理的部分，背压是流式处理中的一个重要概念，这里不做过多的介绍，感兴趣的可以自行了解。另外你可以将这整个过程从 http 请求中抽离出来，做一个普通的文件读取流和写入流的限流操作，便于理解：

```ts
const fileRead = fs.createReadStream('abc.txt')
const response = fs.createWriteStream('cba.txt')
const throttle = new Throttle({ rate: 100 * 1024 }) // 100kb/s

// 文件读取流向 throttle 写入数据，当存在背压时，暂停文件读取流
fileRead.on('data', chunk => throttle.write(chunk) === false && fileRead.pause())

// throttle 向 response 写入数据，当存在背压时，暂停 throttle
throttle.on('data', chunk => response.write(chunk) === false && throttle.pause())

// throttle 清空缓冲区后，文件读取流继续向 throttle 写入数据
throttle.on('drain', () => fileRead.resume())

// response 清空缓冲区后，throttle 继续向 response 写入数据
response.on('drain', () => throttle.resume())

// 文件读取流结束，关闭 throttle
fileRead.on('end', () => throttle.end())

// throttle 结束，关闭 response
throttle.on('end', () => response.end())
```

## 总结

通过上述插件，我们直接在 ViteDevServer 中实现了限流功能，从后端处来模拟不良网络环境，降低前端开发对此类问题的调试成本。当然，这只是本文描述的一种场景，也许你可以通过这个插件的实现思路，来做一些更加有趣的事情。

这个限流插件目前已经放在我的 <mdi-github /> [Github](https://github.com/ArcherGu) 上，欢迎大家使用和提出意见: [vite-plugin-rate-limiter](https://github.com/ArcherGu/vite-plugin-rate-limiter.git) .



