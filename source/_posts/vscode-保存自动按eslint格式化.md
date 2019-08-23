---
title: vscode 保存自动按eslint格式化
categories:
  - 笔记
tags:
  - 开发工具
  - vscode
  - vue
  - eslint
date: 2019-03-27 14:26:43
---

三步走：

1. 安装 vuter，eslint，Prettier-code fromatter
   vuter 是 vue 高高亮插件，安装后 vscode 就可以识别`.vue`文件了
2. 配置 vscode 首选项
   选择 file 》Preferences 》Settings 打开配置。然后选择 User Settings，点击右上角的`{}`按钮，进入文本编辑状态
3. 配置内容

<!-- more -->

将下面的内容复制到配置里就可以了

```
{
  "workbench.editor.enablePreview": false, //打开文件不覆盖
  "search.followSymlinks": false, //关闭rg.exe进程
  "editor.minimap.enabled": false, //关闭快速预览
  "files.autoSave": "afterDelay", //打开自动保存
  "editor.lineNumbers": "on", //开启行数提示
  "editor.quickSuggestions": {
    //开启自动显示建议
    "other": true,
    "comments": true,
    "strings": true
  },
  "editor.tabSize": 2, //制表符符号eslint
  "editor.formatOnSave": true, //每次保存自动格式化
  "eslint.autoFixOnSave": true, // 每次保存的时候将代码按eslint格式进行修复
  "prettier.eslintIntegration": true, //让prettier使用eslint的代码格式进行校验
  "prettier.semi": false, //去掉代码结尾的分号
  "prettier.singleQuote": true, //使用带引号替代双引号
  "javascript.format.insertSpaceBeforeFunctionParenthesis": true, //让函数(名)和后面的括号之间加个空格
  "vetur.format.defaultFormatter.html": "js-beautify-html", //格式化.vue中html
  "vetur.format.defaultFormatter.js": "vscode-typescript", //让vue中的js按编辑器自带的ts格式进行格式化
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "force-aligned" //属性强制折行对齐
    }
  },
  "eslint.validate": [
    //开启对.vue文件中错误的检查
    "javascript",
    "javascriptreact",
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "vue",
      "autoFix": true
    }
  ]
}

```
