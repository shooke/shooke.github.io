---
title: require.context使用说明
categories:
  - 笔记
tags:
  - 前端开发
  - webpack
date: 2019-07-05 15:21:32
---
## 简介
require.context是Webpack中用来管理依赖的一个函数，使用方式如下：
```
require.context(directory, useSubdirectories = false, regExp = /^\.\//)
```
第一个参数表示相对的文件目录，
第二个参数表示是否包括子目录中的文件，
第三个参数表示引入的文件匹配的正则表达式。

<!-- more -->

## 返回值
require.context的返回值是一个函数对象，他提供了一个`keys()`方法，用来返回遍历到的文件或目录。
它自身可以作为函数使用，接收一个文件路径（必须是require.context遍历过的），用来获取文件返回的对象。

## 使用实例
目录结构
```
├── routes
│   ├── overview.js
│   └── settings.js
└── index.js
```
`routes/overview.js`代码如下
```
export default {
    path: '/overview',
    name: '/overview',
    meta: {
      title: '查看列表',
      auth: true
    },
    component: _import('overview')
  }
```
`routes/settings.js`代码如下
```
export default {
    path: '/settings',
    name: '/settings',
    meta: {
      title: '配置',
      auth: true
    },
    component: _import('settings')
  }
```
`index.js`代码如下
```
// 返回的files是个函数对象
const files = require.context('./routes', false, /\.js$/)
let routes = []
// 使用keys()方法获取文件，循环处理每个文件
files.keys().forEach(key => {  
    // 使用files(key)获取文件对象
    for (let r of files(key)) {
      routes.push(r)
    }
  }
})

export {
  routes
}

```

## 参考资料
https://asyncoder.com/2018/07/07/Webpack%E4%B8%AD%E7%9A%84require.context%E5%A6%99%E7%94%A8/
https://www.jianshu.com/p/78f7b19932cb
https://segmentfault.com/a/1190000017160862