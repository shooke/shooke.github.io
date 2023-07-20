---
title: 使用vue cli 3项目打包到指定目录
categories:
  - 笔记
tags:
  - vue
  - vue cli
date: 2019-08-22 21:16:33
---
日常打包执行`npm run build`会将代码打包至`dist`目录下，各种js引入，均已网站根目录为依据。我们想要把项目作为子目录访问时就需要做些配置了。
<!-- more -->
## 1 设置打包路径
vue.config.js文件中配置`publicPath`属性，这样在打包后`dist`中`index.html`中所有的文件引入都会加上配置的前缀。打包完成后我们将dist重命名成`targetPath`(设置的地址)，然后将文件夹上传到网站根目录即可。
```
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/targetPath/' : '/'
}
```
## 2 设置路由基础路径
在路由配置文件中设置`base`选项，如果不设置，到时候会出现找不到模块的情况。`process.env.BASE_URL`是一个vue cli中内置的变量，他的值就是vue.config.js中配置的`publicPath`的值。如果不想用这个变量，也可以自己定义。
```
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  ...
})
```
## 3 配置服务器
如果项目的路由模式采用了`history`模式，则需要配置一下web服务器。
这里以nginx为例，上面设置的目录是`targetPath`我们应该做如下配置。注意一定要加上`targetPath`,否则会出现404错误
```
server{
  ...
  location /targetPath {
    try_files $uri $uri/ /targetPath/index.html;
  }
  ...
}

```

## 参考资料
publicPath参数说明：https://cli.vuejs.org/zh/config/#publicpath
vue cli环境变量说明：https://cli.vuejs.org/zh/guide/mode-and-env.html#在客户端侧代码中使用环境变量
vue router路由base参数说明：https://router.vuejs.org/zh/api/#base
服务器配置说明：https://router.vuejs.org/zh/guide/essentials/history-mode.html#后端配置例子
