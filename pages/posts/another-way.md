---
title: 🍃 不上茶屋 开发过程中的思路转换
date: 2022-03-4T08:00:00.000+00:00
tags: ['CSS', 'Canvas', '经验分享']
tagsColor: ['#1198cf', '#d85235', '#268785']
duration: 15min
---

<blockquote>
将一个小玩具做两遍，会有一些不同的收获。
</blockquote>

## 背景
<code>[🍃 不上茶屋](https://teahouse.archergu.me/)</code> 是我在2022年情人节 / 元宵节前夕给我老婆制作的一个小玩具。这个玩意的主要功能就是模仿市面上的茶饮点单应用，用户通过自己选择茶底，配料的方式来组合自己的茶饮，当然，它不会真正的为你下单购买茶饮，仅仅是最后组成一个茶饮的模型并产生一张图片用于分享。

制作这个玩具的动机是因为我们的二宝即将出生，而我老婆平时有喝奶茶/果茶的习惯，显然，怀孕期间是不建议孕妇饮用这些茶饮的，所以我想通过这个小玩具来满足一下老婆长久空虚的味蕾 (😂大脑皮层)，顺便也想帮助现在的都市白领们减少这些茶饮 (奶茶/果茶/咖啡/苏打水...) 的摄入，毕竟这些商业茶饮都不是太健康，长期饮用肯定对身体不好嘛。

实际上，这个玩具我制作了两次，第一次是通过 CSS 来设计茶饮模型的，第二次则是通过 Canvas 来绘制茶饮模型。这几天老婆临近生产，我们提前住院待产，趁着宝宝还没出生，医院里又没有什么事情，我想通过这篇 blog 来分享下这个玩具设计制作两次的原因。

## 另类茶饮应用
<code>🍃 不上茶屋</code> 虽然是一个模仿茶饮点单的应用，但是它又有些不同，模仿仅仅是 UI 的布局部分，应用的头部是茶饮店铺的一些基本信息，主要是店铺的名称和 logo，而我又添了一个<code>外送/自取</code>的 Switch 来切换一句俏皮的话语，也用来说明这个茶饮应用并不会真正的让你喝到这杯茶。主体部分的左侧是一个茶底选择的 Tab，用于切换不同的茶底。右侧则与常规茶饮应用的产品列表不同，由于这是一个游戏性质的玩具，所以我在这里放置的是本文的重点——茶饮模型。

具体的操作流程是这样的，用户进入后，可以通过茶底 Tab 选择不同的茶底，茶饮模型的液体会随之切换，为了效果生动一些，茶杯中的液体是有流动效果的 (液体顶部有波浪流动动画)，不同的茶底除了颜色透明度的区别，也会有一些符合茶底的细节上的区别，比如红茶/绿茶会有不同的茶叶漂浮在液体中，苏打水则会有气泡上浮的动画。用户选择完茶底后就可以进入 DIY 环节。

DIY 环节中，左侧的茶底 Tab 会收缩隐藏起来，取而代之的是几样我们常见的茶饮配料，比如珍珠椰果之类的。用户可以选择或者去除这些配料，来打造自己喜欢的茶饮。当然，这些配料也会在茶底液体中体现出来，还是为了生动的效果，这些配料或多或少都有一些小动画。

完成配料选择后，来到最后的享用环节，当然，这是一个小玩具，不会为你真正的下单茶饮哦，所以就自己脑补下吧 (不上茶屋，即不去茶饮店铺，戒奶茶专用～)，这个环节其实主要是生成一张茶饮模型的图片用于下载分享，毕竟茶喝晒朋友圈也是姑娘们常做的事情嘛。用户可以在此环节选择一个适合的背景颜色，让图片更加漂亮。

![share](/images/teahouse.jpeg "teahouse-share")

整个小玩具的大致流程差不多就是这样，你可以把它当作一个茶饮制作模拟器来玩，它的核心部分就是茶饮模型，毕竟你的大部分操作都是体现在它上面。

接下来我想写一下这个小玩具我制作两次的原因，不过在此之前我需要先介绍下用到的一些技术栈。首先是开发构建工具，依然快到心动的 <vscode-icons-file-type-vite /> [Vite.js](https://vitejs.dev/) 。然后是前端框架，依然是我们熟悉的 <vscode-icons-file-type-vue /> [Vue.js](https://v3.vuejs.org/)。一些其他的插件工具则可以看一下项目的 <code>[源码](https://github.com/ArcherGu/archers-teahouse)</code>，这里就不过多介绍了。

## 第一版的问题

第一次设计的时候，我采用了 CSS 来制作这个茶饮模型，毕竟通过上面的流程描述，你也应该能大概 get 到这是一个比较简单的东西，无非是画出一杯茶，加一些配料，然后加上少许的动画，以目前 CSS 的能力来说这些都比较容易实现的。

首先是最外面的容器，杯子。一个矩形，高一点，窄一点，具体的宽高可以通过 vue3 最新的 <code>[v-bind() in css](https://vuejs.org/api/sfc-css-features.html#v-bind-in-css)</code> 绑定到样式中，这样就可以提供一个杯子尺寸选择的功能了。再加个略带灰色的透明边框，顶部薄一点，底部厚一点。最后给这个杯子加个 transform 的 perspective 透视效果，绕着x轴稍微旋转一点，就可以做出杯子上大下小的效果了。当然，给杯子的外面加一个 relative 的父元素，作为内部元素绝对定位的基底。
```css
.cup {
    width: v-bind(cupWidth);
    height: v-bind(cupHeight);
    border: 5px solid rgba(254, 254, 254, 0.6);
    border-top: 0.2px solid rgba(255, 255, 255, 0.4);
    border-bottom: 10px solid rgba(255, 255, 255, 0.4);
    transform: perspective(15px) rotateX(-1deg);
}
```

接下来，就是茶底了。茶底需要有一个波浪动画，我的思路是用 svg 画一个比茶杯大一些的矩形，然后矩形的顶部画成波浪线，这样就有了一个顶部是波浪形的封闭矩形了。接着通过 CSS 的 animation 给这个波浪矩形加一段横向的无限循环平移动画。在 svg 的外部增加一个 overflow: hidden 的容器，这个容器的尺寸限制在茶杯内部，即宽度需要减去茶杯左右的边框宽度，高度比茶杯高度适当小一点，这样茶就不会有即将溢出的样子了，通过绝对定位将这个茶底容器放在杯子里，适当调整定位符合实际情况。这样 svg 在容器里平移时超出的部分就不会显示出来，看上去就像茶杯里的液体在做波浪形的流体动画。至于茶底的颜色，则可以通过 svg 的 `<linearGradient>` 标签来设置，而且可以是带透明度的渐变色，让茶底看上去更加的逼真，为其绑定两个变量，用于不同茶底时切换不同的颜色。

```html
<template>
    <div class="base-tea">
        <div class="wave-wrapper">
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="1000"
                height="1000"
                viewBox="0 0 1000 1000"
                xml:space="preserve"
            >
                <linearGradient id="linearTeaColor" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" :stop-color="color" />
                    <stop offset="100%" :stop-color="linearColor" />
                </linearGradient>

                <path
                    fill="url(#linearTeaColor)"
                    class="wave"
                    d="M300,300V2.5c0,0-0.6-0.1-1.1-0.1c0,0-25.5-2.3-40.5-2.4c-15,0-40.6,2.4-40.6,2.4
            c-12.3,1.1-30.3,1.8-31.9,1.9c-2-0.1-19.7-0.8-32-1.9c0,0-25.8-2.3-40.8-2.4c-15,0-40.8,2.4-40.8,2.4c-12.3,1.1-30.4,1.8-32,1.9
            c-2-0.1-20-0.8-32.2-1.9c0,0-3.1-0.3-8.1-0.7V300H300z"
                />
            </svg>
        </div>
    </div>
</template>
```

由于茶底元素也是放在杯子元素里，所以同样会因为杯子的透视变换而变换。至此这杯茶基本的要素就已经存在了。后面的一些配料设计，配料动画以及步骤切换时的逻辑都不是本文讨论的部分，感兴趣的朋友可以直接查看源码。

这个就是第一版的设计思路，通过常规的 html 元素加上 CSS 和 svg 的加成，制作一杯看上去不错的茶饮，现在我们来谈谈这里暴露出的问题。在上面的内容里我们知道这个玩具最后需要产生一张图片用于分享，第一版采用的是 html + css + svg，所以自然而然的我准备使用 <code>[dom-to-image](https://www.npmjs.com/package/dom-to-image)</code> 这个库来将茶饮模型转换为图片，接下来问题就出现了，在大部分浏览器上这样做没有太大的问题，转换出来的图片对原来的茶饮模型还原度较高。但是在 safari 就出现问题了，`transform: perspective` 没有被正常的解析，导致生成的图片出现了歪曲的现象。

![error](/images/teahouse_error.jpg "teahouse-share")

对于这个问题，我查找了`dom-to-image` 的一些 issues 以及网上的一些讨论话题，但是没有任何收获。而这个 `dom-to-image` 库本身也已经在几年前停止了维护，所以对目前的浏览器版本和标准肯定也存在一定的脱节。花了一些时间后，我决定不再此问题上继续钻牛角尖，必须换一个思路来解决问题。

## 另一个思路的第二版

有了第一版的经验后，第二版设计时，我考虑到茶饮模型需要一种更加通用化的转变为图片的方式，另外，茶饮模型依然需要支持各种动画效果，自然而然我想到了 html5 的 `<canvas>`。Canvas 可以非常简单的将画布里的内容转化为图片，而且 Canvas 支持更加自由的动画效果。实际上在我平时的工作中其中一项内容就是 webGL/webGPU 的开发工作，不过工作中做的更多的是 3D 效果罢了。

我们的茶饮模型不需要 3D 化，只要一个 2D 画面即可，所以我选择了常用的 <code>[PixiJS](https://pixijs.com/)</code> 库来进行模型绘制，再加上 <code>[gsap](https://greensock.com/gsap/)</code> 库来为 PixiJS 对象添加动画效果。

在第一版时由于茶杯，茶底还有配料都是基于 html 的，所以都是 `.vue` 的组件，这一次在 Canvas 上绘制只有一个 `<canvas>` 标签，那么我们就可以将这些对象都抽离到 `.ts` typescript 文件中，做成一个个的 class，然后组装起来，这样一来，各类状态更加便于管理，茶饮里的各类部件便于进行抽象。比如茶饮里的各种配料，都可以继承与一个 `BaseItemsContainer` 的基类，实现里面的方法，而他们的显示与否，动画与否这些状态，也可以统一的进行控制。

```ts
import type { Graphics } from 'pixi.js'
import type { CupSize } from '@/types'
import { CUP_HEIGHT } from '@/config'

export interface BaseItem {
  item: Graphics
  tween?: gsap.core.Tween
}

export interface Options {
  cupSize?: CupSize
  visible?: boolean
}

export abstract class BaseItemsContainer {
  protected group: BaseItem[] = []
  protected cupHeight: number
  private _visible: boolean

  constructor({ cupSize = 'M', visible = false }: Options) {
    this._visible = visible
    this.cupHeight = CUP_HEIGHT[cupSize]
  }

  get items() {
    return this.group.map(e => e.item)
  }

  get visible() {
    return this._visible
  }

  set visible(val: boolean) {
    this._visible = val
    this.group.forEach(e => e.item && (e.item.visible = val))
  }

  abstract draw(): any

  abstract animate(): any

  abstract changeVisible(visible: boolean): any

  abstract changeCupSize(cupSize: CupSize): any
}
```

具体的设计不在这里一一展开，感兴趣的朋友可以直接查看源码。最终，通过 Canvas 绘制的茶饮模型和第一版的也非常接近，而且可以轻松的通过 Canvas 的 API 进行图片转换，并且不会出现歪曲失真的情况。另外，这一版的设计也非常容易进行扩展，未来如果需要各种奇怪的配料，或者花哨的茶饮效果都可以通过强大的 Canvas 画布进行自由的绘制。

## 最后说两句

这个小玩具老婆虽然有些许的吐槽，不过总体上还是比较满意的，而对于我自己，也增加了更多的设计思路。很多时候我们做东西会遇到一些奇怪的问题，有些问题容易解决，有些问题则超出我们自己的能力范围，这个时候不妨也可以换种思路来进行，技术路线在一定的情况下也是可以灵活调整的，只要我们的目的不变就行了。