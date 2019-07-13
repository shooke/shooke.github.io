---
title: vue-cli3预渲染处理
categories:
  - 前端开发
tags:
  - vue
  - vue-cli
  - 预渲染
date: 2019-07-13 10:29:01
---
vue模块化开发很方便，但也有问题，那就是seo。解决seo问题有两种方案，一种是ssr(服务端渲染)，还有一种是预渲染，只针对部分需要seo的页面进行渲染即可。
<!-- more -->
## 预渲染配置步骤
1. 安装预渲染插件
```
npm install prerender-spa-plugin --save-dev
```
2. 配置vue.config.js中的webpack设置，因为预渲染就是基于webpack打包的过程中实现的。
```
// 这三项一定要有，因为下面configureWebpack中用到了
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const path = require('path');

module.exports = {
  // 预渲染关键配置
  configureWebpack: () => {
    if (process.env.NODE_ENV !== 'production') return;
    return {
      plugins: [
        new PrerenderSPAPlugin({
          // 生成文件的路径，也可以与webpakc打包的一致。
          // 下面这句话非常重要！！！
          // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
          staticDir: path.join(__dirname, 'dist'),
  
          // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
          routes: ['/', '/about'],
  
          // 这个很重要，如果没有配置这段，也不会进行预编译
          renderer: new Renderer({
            inject: {
              foo: 'bar'
            },
            headless: false,
            // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
            renderAfterDocumentEvent: 'render-event'
          })
        })
      ]
    };
  }
}
```
3. 修改`mian.js`，上面配置中有个`renderAfterDocumentEvent`设置了一个事件，如果`main.js`需要在`mounted`时监听事件，否则不会执行预渲染
```
new Vue({
  router,
  store,
  render: (h) => h(App),
  // 添加mounted，不然不会执行预编译
  mounted() {
    document.dispatchEvent(new Event('render-event'));
  }
}).$mount('#app');
```
4. 执行`npm run build`进行编译。在编译的过程中会弹出一个浏览器窗口对每个预编译的页面进行展示，不要关闭它，等渲染完毕，它会自动关闭的。

## 项目源码
https://gitee.com/shooke/vuetool/tree/master/vue-demo-prerender

## 相关资料
vue-cli2预渲染请看https://juejin.im/post/5b8ba25751882542f25a6cc8