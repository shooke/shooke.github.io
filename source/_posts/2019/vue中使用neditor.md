---
title: vue中使用neditor
categories:
  - 笔记
tags:
  - vue
  - neditor
  - ueditor
date: 2019-09-03 16:48:11
---
neditor是从ueditor改写过来了，做了不少优化，我最喜欢的就是去掉了服务端附件配置请求。还有一个有点就是，可以很方便的对接七牛cdn或oss。
如果是简单的使用可以用`vue-neditor-wrap`,复杂场景下会有bug，所以自己写了个组件，将必要的js引入放到了index.html中。下面是使用注意事项，追后有本示例的源码。

<!-- more -->

## 将neditor放到项目中
这里将neditor放到/public下

## 配合public/index.html添加neditor引用
```
<script type="text/javascript" charset="utf-8" src="<%= BASE_URL %>lib/neditor/neditor.config.js"></script>
<script type="text/javascript" charset="utf-8" src="<%= BASE_URL %>lib/neditor/neditor.all.min.js"> </script>
```
## 创建一个模块初始化neditor
components/neditor/index.vue
```
<template>
<div>
  <script :id="id" :name="name" type="text/plain"></script>
  </div>
</template>

<script>
import config from './ueditor.config'
// 一个简单的事件订阅发布的实现,取代原始Event对象,提升IE下的兼容性
class LoadEvent {
  constructor () {
    this.listeners = {}
  }
  on (eventName, callback) {
    this.listeners[eventName] === undefined
      ? (this.listeners[eventName] = [])
      : ''
    this.listeners[eventName].push(callback)
  }
  emit (eventName) {
    this.listeners[eventName] &&
      this.listeners[eventName].forEach(callback => callback())
  }
}
export default {
  name: 'VueNeditorWrap',
  data () {
    return {
      id:
        'editor' +
        Math.random()
          .toString()
          .slice(-10),
      editor: null,
      isReady: false, // 实例是否已经ready
      readyValue: '', // ready之后给编辑器设置的值
      defaultConfig: {
        UEDITOR_HOME_URL: './public/NEditor/',
        enableAutoSave: false
      }
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: function () {
        return {}
      }
    },
    init: {
      type: Function,
      default: function () {
        return () => {}
      }
    },
    destroy: Boolean,
    name: String
  },
  computed: {
    mixedConfig () {
      return Object.assign({}, this.defaultConfig, config)
    }
  },
  methods: {
    // 添加自定义按钮
    registerButton: ({ name, icon, tip, handler, UE = window.UE }) => {
      UE.registerUI(name, (editor, name) => {
        editor.registerCommand(name, {
          execCommand: () => {
            handler(editor, name)
          }
        })
        const btn = new UE.ui.Button({
          name,
          title: tip,
          cssRules: `background-image: url(${icon}) !important;background-size: cover;`,
          onclick () {
            editor.execCommand(name)
          }
        })
        editor.addListener('selectionchange', () => {
          const state = editor.queryCommandState(name)
          if (state === -1) {
            btn.setDisabled(true)
            btn.setChecked(false)
          } else {
            btn.setDisabled(false)
            btn.setChecked(state)
          }
        })
        return btn
      })
    },
    // 实例化编辑器之前-JS依赖检测
    _beforeInitEditor (value) {
      // console.log('_beforeInitEditor', value + '--')
      // 准确判断ueditor.config.js和ueditor.all.js是否均已加载 仅加载完ueditor.config.js时UE对象和UEDITOR_CONFIG对象也存在,仅加载完ueditor.all.js时UEDITOR_CONFIG对象也存在,但为空对象
      !!window.UE &&
      !!window.UEDITOR_CONFIG &&
      Object.keys(window.UEDITOR_CONFIG).length !== 0 &&
      !!window.UE.getEditor
        ? this._initEditor(value)
        : this._loadScripts().then(() => this._initEditor(value))
    },
    // 实例化编辑器
    _initEditor (value) {
      this.$nextTick(() => {
        this.init()
        this.editor = window.UE.getEditor(this.id, this.mixedConfig)
        this.readyValue = value
        this.editor.addListener('ready', () => {
          this.isReady = true
          this.$emit('ready', this.editor)
          this.editor.setContent(this.readyValue)
          this.editor.addListener('contentChange', () => {
            // console.log('input', this.editor.getContent())
            this.$emit('input', this.editor.getContent())
          })
        })
      })
    },
    // 动态添加JS依赖
    _loadScripts () {
      // 确保多个实例同时渲染时不会重复创建SCRIPT标签
      if (window.loadEnv) {
        return new Promise((resolve, reject) => {
          window.loadEnv.on('scriptsLoaded', function () {
            resolve()
          })
        })
      } else {
        window.loadEnv = new LoadEvent()
        return new Promise((resolve, reject) => {
          // 如果在其他地方只引用ueditor.all.min.js，在加载ueditor.config.js之后仍需要重新加载ueditor.all.min.js，所以必须确保ueditor.config.js已加载
          // this._loadService().then(() => this._loadConfig()).then(() => this._loadCore()).then(() => {
          //   window.loadEnv.emit("scriptsLoaded");
          //   resolve();
          // });
          const that = this
          that._loadParse().then(() => that._loadConfig()).then(() => that._loadCore()).then(() => that._loadService()).then(() => {
            window.loadEnv.emit('scriptsLoaded')
            resolve()
          }).catch(err => {
            console.error(err)
          })
        })
      }
    },
    _loadConfig () {
      return new Promise((resolve, reject) => {
        if (
          !!window.UE &&
          !!window.UEDITOR_CONFIG &&
          Object.keys(window.UEDITOR_CONFIG).length !== 0
        ) {
          resolve()
        }
      })
    },
    _loadService () {
      return new Promise((resolve, reject) => {
        let coreScript = document.createElement('script')
        coreScript.type = 'text/javascript'
        coreScript.src = this.mixedConfig.UEDITOR_HOME_URL + 'neditor.service.js'
        document.getElementsByTagName('head')[0].appendChild(coreScript)
        coreScript.onload = function () {
          resolve()
        }
      })
    },
    _loadParse () {
      return new Promise((resolve, reject) => {
        let coreScript = document.createElement('script')
        coreScript.type = 'text/javascript'
        coreScript.src =
          this.mixedConfig.UEDITOR_HOME_URL + 'neditor.parse.min.js'
        document.getElementsByTagName('head')[0].appendChild(coreScript)
        coreScript.onload = function () {
          resolve()
        }
      })
    },
    _loadCore () {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    // 设置内容
    _setContent (value) {
      if (this.isReady) {
        // console.log('setContentisReady', value)
        value === this.editor.getContent() || this.editor.setContent(value)
      } else {
        // console.log('noisReady', value)
        this.readyValue = value
      }
    }
  },
  beforeDestroy () {
    if (this.destroy && this.editor && this.editor.destroy) {
      this.editor.destroy()
    }
  },
  // v-model语法糖实现
  watch: {
    value: {
      handler (value) {
        // console.log('vvv===', value)
        this.editor ? this._setContent(value) : this._beforeInitEditor(value)
      },
      immediate: true
    }
  }
}
</script>

```
components/neditor/neditor.config.js
```
export default {
  UEDITOR_HOME_URL: process.env.BASE_URL + 'neditor/',
  // 编辑器不自动被内容撑高
  autoHeightEnabled: false,
  // 初始容器高度
  initialFrameHeight: 350,
  // 初始容器宽度
  initialFrameWidth: '100%',
  catchRemoteImageEnable: false,
  imageMaxSize: 10248000, // 上传大小限制，单位B
  zIndex: 9999,
  // 关闭自动保存
  enableAutoSave: false,
  // serverUrl: 'http://localhost/php/controller.php'
  serverUrl: '',

  imageUploadService: function (context, editor) {
    return {
      /** 
       * 触发fileQueued事件时执行
       * 当文件被加入队列以后触发，用来设置上传相关的数据 (比如: url和自定义参数)
       * @param {Object} file 当前选择的文件对象
       */
      setUploadData: function (file) {
        return file;
      },
      /**
       * 触发uploadBeforeSend事件时执行
       * 在文件上传之前触发，用来添加附带参数
       * @param {Object} object 当前上传对象
       * @param {Object} data 默认的上传参数，可以扩展此对象来控制上传参数
       * @param {Object} headers 可以扩展此对象来控制上传头部
       * @returns 上传参数对象
       */
      setFormData: function (object, data, headers) {
        return data;
      },
      /**
       * 触发startUpload事件时执行
       * 当开始上传流程时触发，用来设置Uploader配置项
       * @param {Object} uploader
       * @returns uploader
       */
      setUploaderOptions: function (uploader) {
        return uploader;
      },
      /**
       * 触发uploadSuccess事件时执行
       * 当文件上传成功时触发，可以在这里修改上传接口返回的response对象
       * @param {Object} res 上传接口返回的response
       * @returns {Boolean} 上传接口返回的response成功状态条件 (比如: res.code == 200)
       */
      getResponseSuccess: function (res) {
        return res.code == 200;
      },
      /* 指定上传接口返回的response中图片路径的字段，默认为 url
       * 如果图片路径字段不是res的属性，可以写成 对象.属性 的方式，例如：data.url 
       * */
      imageSrcField: 'url'
    }
  },

  /**
   * 视频上传service
   * @param {Object} context UploadVideo对象 视频上传上下文
   * @param {Object} editor  编辑器对象
   * @returns videoUploadService 对象
   */
  videoUploadService: function (context, editor) {
    return {
      /** 
       * 触发fileQueued事件时执行
       * 当文件被加入队列以后触发，用来设置上传相关的数据 (比如: url和自定义参数)
       * @param {Object} file 当前选择的文件对象
       */
      setUploadData: function (file) {
        return file;
      },
      /**
       * 触发uploadBeforeSend事件时执行
       * 在文件上传之前触发，用来添加附带参数
       * @param {Object} object 当前上传对象
       * @param {Object} data 默认的上传参数，可以扩展此对象来控制上传参数
       * @param {Object} headers 可以扩展此对象来控制上传头部
       * @returns 上传参数对象
       */
      setFormData: function (object, data, headers) {
        return data;
      },
      /**
       * 触发startUpload事件时执行
       * 当开始上传流程时触发，用来设置Uploader配置项
       * @param {Object} uploader
       * @returns uploader
       */
      setUploaderOptions: function (uploader) {
        return uploader;
      },
      /**
       * 触发uploadSuccess事件时执行
       * 当文件上传成功时触发，可以在这里修改上传接口返回的response对象
       * @param {Object} res 上传接口返回的response
       * @returns {Boolean} 上传接口返回的response成功状态条件 (比如: res.code == 200)
       */
      getResponseSuccess: function (res) {
        return res.code == 200;
      },
      /* 指定上传接口返回的response中视频路径的字段，默认为 url
       * 如果视频路径字段不是res的属性，可以写成 对象.属性 的方式，例如：data.url 
       * */
      videoSrcField: 'url'
    }
  }
}

```
## 在使用组件的地方调用即可
```
<template>
  <div class="home">
    <Neditor v-model="content"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Neditor from '@/components/neditor/index.vue'

export default {
  name: 'home',
  data(){
    return {
      content: 'hello'
    }
  },
  components: {
    Neditor
  }
}
</script>
```

## 实例源码
https://gitee.com/shooke/vue-demo/tree/master/neditor

## 参考资料
https://github.com/caiya/vue-neditor-wrap
https://github.com/notadd/neditor