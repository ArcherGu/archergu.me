---
title: Why GitLab?
date: 2022-05-5T08:00:00.000+00:00
tags: ['DevOps', 'GitLab', 'CI/CD']
tagsColor: ['#03d25f', '#fc6d26', '#735ca2']
duration: 15min
---

<blockquote>
GitHub 虽然是我们平时最常用的开源代码托管平台，但是在企业领域 GitLab 占据着相当大的份额，特别是 GitLab 在 DevOps 方面展现出了非常强大的实力。
</blockquote>

21 年的时候看到了一条新闻，<vscode-icons-file-type-gitlab /> GitLab 在国内成立了合资公司 —— 极狐 GitLab。因为当时部门里使用的也是私有搭建的 GitLab，所以我大概了解了一下，并且在下半年的时候将部门里的 GitLab CE 版本更换成了极狐版本。

今年在极狐的线上平台（公共的代码托管平台）闲逛时，发现了一个有趣的项目 [Why GitLab](https://jihulab.com/gitlab-cn/why-gitlab)，这是一个 Node Cli，用户可以在命令行里选择对应的功能，然后输出一份关于 GitLab 的解决方案和调研报告。这对于我这种兼职维护部门 DevOps 的人来说，是一个很好的工具。不过这个工具的使用方式似乎还不够便利，毕竟对于技术人员来说，使用命令行如同喝水吃饭一般自然，但是对于其他人来说一个用于生成报告的 Web 网站也许是一个更好的选择。那么，我们就开始搭建一个吧！

进入传送门尝试：[Why GitLab Web](https://archergu.gitlab.io/why-gitlab-web/)

## 需求分析

网站的使用逻辑需要和 Why GitLab 的 Node Cli 基本保持一致（尊重原创😀），所以一开始需要一个类似于功能需求调查问卷的页面，这个页面也作为网站的主页面，当然，这个页面上应该有一些介绍性的内容，介绍下网站的基本功能，不能让用户在打开网站的时候过于突兀了。

当用户完成问卷后，应该被引导到报告页面，报告页面顾名思义就是需要根据用户先前完成的问卷来生成对应的解决方案和调研报告，这个部分也和 Cli 一致，只不过需要将 Cli 中的那些 markdown 文件进行合并转换成 HTML 渲染在浏览器里。

另外就是一些细节功能，比如 Cli 支持中英文的多语言切换，那么我们也需要一个切换语言的功能。另外在生成报告时可能会存在网络延迟和文件转换耗时，所以在主页面导航到报告页面时（报告完全生成之前）需要有一个过度的画面，让报告的生成更加平滑。

最后，这个网站是一个简单的静态网站，所以没有后端。

## 技术 & 设计

完成需求分析后，我们就开始技术选型。由于我个人平时使用的最多的是 <vscode-icons-file-type-vue /> Vue.js 相关的技术栈，所以我的选择是 <vscode-icons-file-type-vite /> Vite.js + <vscode-icons-file-type-vue /> Vue.js（3.x） 的组合。其他相关的技术：
- 路由：Vue Router
- 多语言：Vue-i18n
- 样式：Windicss + Sass
- 图标：Unplugin Icons
- MD 转 HTML：Markdown It

另外，由于 Cli 有一个 `/docs` 的目录用于存放 markdown 文件文档，为了未来和 Cli 的文档保持一致，需要定期将它的 `/docs` 目录同步到我们的项目中，为了目录结构的一致以及对开发时期的文件加载处理，我们需要自己写一个 Vite Plugin 来处理这一块的需求。

技术选型完成了，接下来就是大致设计下这个网站。网站非同 Cli 简约的命令行界面，稍微加点设计元素，会让用户的体验更加舒服。

这里我们采用的是一个简单的布局，顶部是一个 Navbar，左上角是 logo，右上角是语言切换，符合大众的操作习惯。

在主页部分，Navbar 下面可以跟上一个 Banner，这里可以放置介绍性的文字，当然文字的排版和样式需要设计一下。Banner 之后就是我们的问卷主体，问卷的样式可以参考极狐 GitLab 的 Form 样式。

报告页面就非常简单了，Navbar 保持不变，下面就是报告的内容。最后，我们增加一个 Fixed 的 Footer 来放置报告的操作按钮，`重新生成` 和 `打印报告`。别忘了报告页面需要一个 Loading 画面，在报告完全生成之前需要开启。考虑到我们拥有多语言功能，所以在 Loading 的时候应该需要避免用户切换语言（否则生成到一半的报告又要回去重新生成，浪费网络资源了），我们的 Loading 画面需要放在在最上层，并且覆盖住整个 Navbar 以及窗口。

![Layout](/images/why-gitlab-layout.jpg)

## CI/CD 

网站的具体实现这里就不展开说了，非常简单的小网站，具体的源码托管在极狐 GitLab 上：[Why GitLab Web](https://jihulab.com/ArcherGu/why-gitlab-web)，感兴趣的朋友可以 Fork 一份研究。

既然我们的代码已经托管在极狐 GitLab 上了，那么就让我们充分发挥 GitLab 强大的 DevOps 功能吧。代码规范检查，单元测试，E2E测试全部交给 CI 自动化完成。另外既然是一个静态网站，不需要后端支持，我们可以完全将其部署在 GitLab Pages 上，构建部署也都交给 GitLab 自动化完成。为了完成上述的功能，按照 GitLab 的要求，我们需要在项目的根目录下放置一个 `.gitlab-ci.yml` 文件，这个文件的内容如下：
```yml
image: node:16

stages:
  - lint
  - test
  - deploy

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .pnpm-store
    - node_modules

before_script:
  - npm config set registry https://registry.npmmirror.com
  - npm i pnpm -g
  - pnpm config set store-dir .pnpm-store
  - pnpm i

lint:
  stage: lint
  script:
    - pnpm run lint

test:
  stage: test
  script:
    - pnpm run test:unit
  artifacts:
    when: always
    reports:
      cobertura: coverage/cobertura-coverage.xml
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

test-e2e:
  stage: test
  image:
    name: cypress/included:9.6.0
    entrypoint: ['']
  script:
    - pnpm run test:ci-e2e
  timeout: 30m

pages:
  stage: deploy
  script:
    - pnpm run build -- --outDir dist/public --base /${CI_PROJECT_NAME}/
    - rm -rf public
    - cp -rf dist/public public
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == "main" && $CI_PROJECT_URL =~ /gitlab.com/
```

首先我们指定了一个 node16 版本的镜像作为我们的基础环境，接着我们定义了三个阶段，分别是：`lint`（检查）、`test`（测试） 和 `deploy`（部署）。因为我们是使用 <vscode-icons-file-type-light-pnpm/> pnpm 作为包管理器，所以设定 Cache 时除了指定 `node_modules`，也需要指定 `.pnpm-store`。后面是一些预备脚本，包括 npm registry 地址的设定，pnpm 的安装，以及项目依赖的安装。

- lint：在此阶段，我们执行 `pnpm run lint` 来进行 eslint 的检查。
- test：此阶段分为两部分，第一部分是基于 <vscode-icons-file-type-vitest/> Vitest 的单元测试，单元测试部分，我们可以使用正则来匹配测试覆盖率，生成一个 Badge（放在 README 文件展示），第二部分是基于 <vscode-icons-file-type-cypress/> Cypress 的 E2E测试，这里需要指定一个带有 Cypress 的镜像作为测试环境。
- deploy：在此阶段会对项目进行构建打包，并且按照 GitLab Pages 的规则，网站目录必须命名成 `public`，然后作为 artifacts 上传。

至此，我们的 CI/CD 配置完成了，每当我们的代码 push 到 GitLab 上时，就会自动执行上述的配置，完成自动化任务。

## 结语

极狐 GitLab 为我们这些国内开发者提供了一个优秀的代码托管平台，并且提供了一个非常强大的 DevOps 系统，你可以使用这套系统完成各种任务，减少工作量。对于企业而言，本土化的解决方案以及技术支持非常友好，而极狐 GitLab 是一个不二选择。