---
title: 将 Web 前端嵌入 QT
date: 2020-04-25T02:00:00.000+00:00
tags: ["QT", "技术分享"]
tagsColor: ["#41cd52", "#268785"]
badge: History
badgeColor: "#E87A90"
duration: 10min
---

<blockquote>
Note: 这是一篇我从整理箱中找出来的过去的文章，所以一些技术细节可能与当下不符合，请阅读者自行判断。
<br/>
<br/>
前置知识: 基础的 QT 开发经验，前端工程化 (Nodejs, npm...)
</blockquote>

由于工作上的关系，我会接触到 <logos-qt/>[QT](https://www.qt.io/) 开发。作为跨平台的客户端开发框架，QT 有非常好的性能优势，但是对于 UI/UX 部分，开发 QT 则需要强大的审美，以及面临大部分控件都必须自己开发的巨大压力。于是我尝试着将生态丰富的 Web 技术引入 QT 中。

## QT 的 Web 容器

QT 和其他技术的混合开发一样，为了嵌入 Web 页面，QT 提供一个所谓的“容器”，用来“容纳” Web 页面。目前的 QT 版本中，过去的 [Qt WebView](https://doc.qt.io/qt-5/qtwebview-index.html) 已经被 [Qt WebEngine](https://doc.qt.io/qt-5/qtwebengine-overview.html) 替代。Qt WebEngine 提供了一个 Web 引擎，可以在 QT 中嵌入 Web 页面。Qt WebEngine 的背后，正是我们熟悉而又陌生的朋友 <openmoji-chromium />[Chromium](http://www.chromium.org/Home)。

对于 Web 嵌入来说，主要是需要理解 JS 是如何和 C++(QT) 完成双向通信的。QT 为我们提供了一个 [QWebChannel](https://doc.qt.io/qt-5/qwebchannel.html)的通信管道。本文中，我们暂时不讨论 QWebChannel 的具体实现，我们只需要考虑如何使用这个通信管道完成 JS 和 C++(QT) 的通信。

## Javascript 调用 C++ 方法

首先，我们需要在 QT 中定义一个类，该类包含了一个插槽函数，回头这个插槽函数可以供 JS 调用:

```cpp
class WebObj : public QObject
{
    Q_OBJECT
    public slots:
    QString sendToQT(QString strParameter)
    {
        QMessageBox::information(NULL, strParameter);
        return "Hi, JS, I'm QT";
    }
};

WebObj *webObj = new WebObj();
QWebChannel *channel = new QWebChannel(this);
channel->registerObject("webObj", webObj);
view->page()->setWebChannel(channel);
```

在 JS 这边，QT 官方为我们提供了一个 <code>[qwebchannel.js](https://github.com/qt/qtwebchannel/blob/5.12/examples/webchannel/shared/qwebchannel.js)</code>，它提供了一个`QWebChannel`类，该类允许你初始化一个通信管道，然后获取到 QT 侧提供的一些信息和方法。`QWebChannel`接收两个参数，第一个参数是 QT 利用 Qt WebEngine 挂载载前端全局环境中的 `window.qt.webChannelTransport`，另外一个参数是一个回调函数，该回调函数在`QWebChannel`完成初始化后调用：

```js
new QWebChannel(qt.webChannelTransport, (channel) => {
  window.webObj = channel.objects.webObj
})
```

然后，我们就可以在 JS 侧愉快的使用 C++ 中使用的方法了:

```js
const result = window.webObj.sendToQT('Hello, QT, I\'m JS')
console.log(result) // Hi, JS, I'm QT
```

## C++ 传递数据给 Javascript

我们可以通过信号的方式将数据从 C++ 传递给 JS，在 C++ 这边，我们需要定义一个信号，然后让 JS 监听这个信号，当 C++ 侧触发这个信号，并通过这个信号传递数据时，JS 侧通过事先准备的回调函数来接收这些数据:

```cpp
// C++ 这里定义信号
class WebObj : public QObject
{
    Q_OBJECT
    public slots:
        QString sendToQT(QString strParameter)
        {
            QMessageBox::information(NULL, strParameter);
            return "Hi, JS, I'm QT";
        }

        void sendToJS(QString strParameter)
        {
            emit someThingChange(strParameter);
        }
    signals:
        void someThingChange(QString strParameter);
};
```

在 JS 侧设置监听:

```js
const callback = (strParameter) => {
  console.log(strParameter)
}
window.webObj.someThingChange.connect(callback)
```

## 个人经验

通过上述的介绍，我们已经完成了基本的双向通信，JS 通过 C++ 提供的插槽函数，可以将参数传递给 C++，让 C++ 进行高效的执行。C++ 则通过信号的方式，将数据发送给 JS。

在这里，我还想分享一些我个人的经验。通常来说，我们将一些复杂的任务交给 QT 侧的 C++ 去完成，但是实际上此时依然在主线程里，所以你直接用 JS 调用一个耗时的 C++ 操作将引起 UI 的阻塞。所以，我在使用时会将任务加入另外一条线程去执行，然后再通过信号的方式将结果传送回 JS。

我在 [Github](https://github.com/ArcherGu) 上传了两个小项目，分别是<code>[QTWebChat_QT](https://github.com/ArcherGu/QTWebChat_QT)</code>和<code>[QTWebChat_JS](https://github.com/ArcherGu/QTWebChat_JS)</code>，你可以通过这个 demo 了解到更多的细节。

<blockquote>
注意：我并没有在生产环境中使用过这项技术，只是完成了一些基础的案例。
</blockquote>
