---
title: vue下使用ueditor，文件直传七牛踩坑记录
categories:
  - 前端开发
tags:
  - vue
  - d2admin
  - ueditor
  - 七牛
date: 2019-07-08 20:18:04
---
## 背景
最近的项目中，需要一个牛X点的文本编辑器。于是选择了ueditor。百度出品，功能完善。
前端框架使用了d2admin,选择它的理由很简单，许多的常用工具做了封装。
项目要求文件上传要绕过后端程序，前端直接传文件到七牛CDN。
<!-- more -->
## 使用步骤
1. 执行`npm i vue-ueditor-wrap`安装`vue-ueditor-wrap`插件
2. 修改`main.js`,添加如下代码
```
import VueUeditorWrap from 'vue-ueditor-wrap'
Vue.component('vue-ueditor-wrap', VueUeditorWrap)
```
3. 创建一个组件封装一下，方便项目中使用，复制一下官方实例的`src/components/d2-ueditor`目录到对应的目录
4. 设置ueditor的目录，修改`src/components/d2-ueditor/ueditor.config.js`
```
export default {
  // ueditor文件的目录
  UEDITOR_HOME_URL: '/lib/ueditor-qn/',
  // 编辑器不自动被内容撑高
  autoHeightEnabled: false,
  // 初始容器高度
  initialFrameHeight: 240,
  // 初始容器宽度
  initialFrameWidth: '100%',
  // 关闭自动保存
  enableAutoSave: false,
  // 文件上传处理
  serverUrl: 'http://localhost/php/controller.php'
}
```
UEDITOR_HOME_URL的路径是相对于根目录的，比如上面的配置就是，放在`public/lib/ueditor-qn`下
5. 下载ueditor文件放到，第4步设置的目录下。因为要用到七牛，所以这里就不用官方的版本了，改用七牛版本的ueditor。
去这里下载就可以了https://github.com/widuu/qiniu_ueditor_1.4.3。下载完成后将文件拷贝到`public/lib/ueditor-qn`目录下。
将php文件夹里的内容，复制到一个可访问的目录，要确保用上面`serverUrl`配置的地址可以访问到

## 坑点记录
1. 七牛版的ueditor有个bug，需要修改一下。`php/config.json`文件的第17行，使用了`//`注释，语法错误了应该使用`/**/`修改一下
2. `dialogs/image/image.js` `dialogs/attachment/attachment.js` `dialogs/video/video.js`这三个文件ajax处理有问题，`uploadBeforeSend`事件获取token的时候，如果前后端跨域了，就有问题。
搜索`dataType : isJsonp ? 'jsonp':'json'`
jquery的ajax处理如果是jsonp方式，async设置就失效了，会自动变成true，使得ajax请求变成了异步处理。这样会造成上传是找不到token。项目中前后端存在跨域时，这个地方直接改成`dataType : 'json'`就可以了。
3. 上传接口有身份验证，处理的方式和第2条一样，在`uploadBeforeSend`阶段增加需要身份验证的header信息就可以了。
4. 前后端跨域问题，给`php/controller.php`添加跨域处理
```
// 星号是允许所有主机，方法和头信息，可以根据实际情况进行修改
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:*');  
header('Access-Control-Allow-Headers:*'); 
```

## 参考资料
https://github.com/widuu/qiniu_ueditor_1.4.3
https://doc.d2admin.fairyever.com/zh/sys-components/ueditor.html
https://github.com/d2-projects/d2-admin
https://github.com/HaoChuan9421/vue-ueditor-wrap