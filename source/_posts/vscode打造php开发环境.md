---
title: vscode打造php开发环境
categories:
  - 开发工具
tags:
  - vscode
  - php
date: 2019-06-20 17:27:42
---

## 文档注释
借助于 PHP DocBlocker 插件，可以快速地在类名、变量名、方法/函数名 上方添加注释。

## 自动补全
借助于 PHP Intelephense 插件，可以实现代码智能提示。
安装后选择 file->preferences->settings 选择右上角`{}`进入配置模式，添加`"php.executablePath": "/usr/bin/php"`，配置上php的路径

## 代码调试
借助于 XDebug 插件，可以实现代码调试。

## 代码格式化
借助于 php-cs-fixer 插件，可以方便地按照某一规则格式化代码，让你时刻保持代码可读性和风格统一。

## 修改历史
借助于 Git Lens 插件，可以方便地查看每行代码的修改历史。