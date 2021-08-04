---
title: 用装饰器给 Electron 提供一个基础框架
date: 2021-08-03T06:00:00.000+00:00
tags: ['Electron', '装饰器', '技术分享']
tagsColor: ['#74b1be', '#D0104C', '#268785']
duration: 10min
---

<blockquote>
前置知识：熟悉 Typescript，有 Electron 项目，ipcRenderer 通信经验。
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

聊完渲染进程部分，接下来需要把 Electron 的主进程改造的像一个常规的后端那样，比如需要 Controller 来处理 api 的请求和响应，需要 Service 来处理一些业务逻辑，需要 Model 来控制数据......

### 装饰器与元数据

在这里主要说明以下 Controller 的设计方式，因为渲染进程调用 api 时，Controller 承接着 api 的请求和响应。一般在 Electron 中的写法是通过 [ipcMain](https://www.electronjs.org/docs/api/ipc-main) 来监听 ipcRenderer 的消息:
```ts
ipcMain.handle('send-msg', (e, msg: string) => {
    console.log(msg) // Hi! Main Process!
    return 'Hello! Renderer Process!';
})
```

在后端设计时，我们为了更好的管理 api 路由，往往会设计各种 Controller 来管理各类请求，而每个 Controller 中又有一些成员函数来响应这些请求。如果按照上述写法，我们需要手动实例化这些 Controller， 然后写很多这样的监听语句来绑定各个 Controller 中的成员函数，非常的麻烦。

为了解决上面提到的问题，这里引入了 Typescript 的[装饰器](https://www.typescriptlang.org/docs/handbook/decorators.html)，文档上对装饰器的说明是:
<blockquote>
装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，访问符，属性或参数上。 装饰器使用 @expression 这种形式，expression 求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。
</blockquote>

另外，还需要引入 Reflect Metadata (元数据)。

什么是元数据[<sup>[1]</sup>](#refer-1)？元数据是用来定义数据的数据。例如，对于一个数据A，它会具有值，数据类型等等描述这个数据的数据。这样的数据，我们称之为元数据。通过元数据反射 API，我们可以为数据添加和获取元数据。Reflect Metadata 的 API 可以用于类或者类的属性上。当我们为类或类的属性添加了元数据之后，构造函数或者构造函数的原型将会具有一个新的 [[Metadata]] 内部属性，该属性将会包含一个键是属性键（或undefined），值是元数据键值的 Map。因此，元数据的定义具有以下特征：
- 当在类C声明上或者类C的静态成员上定义元数据时，元数据会存储在 C.[[Metadata]] 中
- 当在类C的实例成员上定义元数据时，元数据会存储在 C.prototype.[[Metadata]] 中
  
另外，为了方便获得运行时类型，TypeScript 定义了三种保留元数据键：

- 类型元数据：使用元数据键 ”design:type”（用来获取属性类型）
- 参数类型元数据：使用元数据键 ”design:paramtypes”（用来获取参数类型）
- 返回值类型元数据：使用元数据键 ”design:returntype”（用来获取返回值类型）

同时，为了使用装饰器和元数据，我们需要在 tsconfig 中激活:
```json
{
    "compilerOptions":{
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
    }
}
```
并引入 [reflect-metadata](https://github.com/rbuckton/reflect-metadata) 库:
```bash
npm i reflect-metadata --save
```
在主进程的入口文件中引用:
```ts
// main.ts
import 'reflect-metadata';
```
理解了装饰器和元数据的概念，以及引入两者的准备工作后，接下来就需要设计一些装饰器。


### Controller 装饰器和 Injectable 装饰器

首先需要解决 Controller 的实例化，这里可以设计一个名为 `@Controller` 的类装饰器:
```ts
export function Controller(): ClassDecorator {
    return (target: object) => {
        // do nothing
    };
}
```
可以看到这个装饰器什么都没有做，只是定义了一个装饰器工厂函数，返回了一个空的类装饰器，为什么这样做呢？当我们使用装饰器时，reflect-metadata 会自动为所装饰的 target 添加上几个默认的元数据信息[<sup>[2]</sup>](#refer-1):
<blockquote>

- 当我们为类使用装饰器时，只会为类添加上 ”design:paramtypes” 的元数据信息，含义为其构造函数的传入参数的类型数组

- 当我们为类中的属性使用装饰器时，只会为该属性添加上 ”design:type” 的元数据，含义为该属性的类型

- 当我们为类中的方法使用装饰器时，会为该属性添加上所有三种保留元数据键，含义分别为方法的类型，传入该方法的形参类型数组，该方法的返回值的类型

</blockquote>

当我们把 `@Controller` 类装饰器放在某个具体的 Controller 上时，就可以在元数据集中获取到这个 Controller 的构造函数的入参类型数组，获取构造函数的入参类型有什么用呢？熟悉后端的朋友应该已经想到了，我们可以做 **依赖注入**，因为 Controller 往往会使用一些 Services 来处理具体的业务，而 Services 又有可能在一些 Controllers 之间共享。所以获取 Controller 构造函数的入参类型，可以便于我们实例化这些 Services，然后在 Controllers 实例化时注入到它们内部以供使用。

为此，又需要设计一个新的装饰器，这个装饰器用来装饰那些需要注入的 Services:
```ts
export function Injectable(name: string): ClassDecorator {
    return (target: object) => {
        Reflect.defineMetadata('name', name, target);
    };
}
```
`@Injectable` 定义了一个 `name` 键用来存放注入项的名称，用于区分各个注入项。另外，作为一个类装饰器，它同样会将注入项的构造函数存入元数据集中。

接下来，就是具体的 Controller 实例化过程。首先，我们需要定义一个数组，将 Controllers 放在其中：
```ts
const controllers = [ MyController ];
```
然后定义一个工厂函数用来自动实例化这些 Controllers 和 Services:
```ts
const ExistInjectable = {};
function factory(constructor) {
    const paramtypes = Reflect.getMetadata('design:paramtypes', constructor);

    const services = paramtypes.map((service) => {
        const name = Reflect.getMetadata('name', service);
        const item = ExistInjectable[name] || factory(service);
        ExistInjectable[name] = item;
        return item;
    });

    return new constructor(...services);
}
```
上面的代码中:
- 从元数据集中获取到这个类的构造函数入参信息
- 遍历入参，从元数据集中获取对应的 `name` 的信息，如果改注入项已经存在，则直接从 `ExistInjectable` 中获取，如果未存在，则递归到工厂函数进行实例化，然后存入 `ExistInjectable`。
- 将这些已经完成实例化的入参传入构造函数实例化类。
  
Controller 实例化:
```ts
for (const ControllerClass of controllers) {
    const controller = factory(ControllerClass);
}
```
这样，通过 `@Controller` 和 `@Injectable` 装饰器，就完成了 Controller 的实例化，并将它们所依赖的 Services 成功注入。







## References

<div id="refer-1">

- [1][2] [「程序猿同事的分享」TypeScript 元数据的理解与使用](https://zhuanlan.zhihu.com/p/166362122)

</div>
