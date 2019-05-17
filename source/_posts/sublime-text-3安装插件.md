---
title: sublime text 3安装插件
categories:
  - 开发工具
tags:
  - sublime
  - sublime text 3
  - package_control
date: 2019-05-17 11:26:28
---

sublime相比其他编辑器最大的优点就是占用内存小。一直用idea和vscode。好久没用sublime了，今天安装了一下新版本3.2.1，想要用它开发vue。安装插件的过程中踩了几个小坑。

## 安装package control
使用网上说的，控制台安装方式，按`ctrl + \` `，输入下面的命令
```
import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())

```

<!-- more -->

结果发现由于网络问题，根本无法安装。于是手动下载插件包。
## 手动安装package control
1. 去https://github.com/wbond/package_control/tree/3.3.0下载插件
2. 把下载好的zip包解压，重命名为Package Control
3. 打开Sublime3，菜单->Preferences->Browse Packages...然后复制Package Control文件夹到该目录
4. 重启Sublime3,如果菜单->Preferences有Package Setting和Package Control就说明安装成功。
5. Ctrl+Shift+p输入install选中Install Package回车就可以安装插件。

>注意去github下载插件一定要选择稳定版，第一次下载了最新的测试版居然报了这个错误：`plugin_host has exited unexpectedly,plugin functionality won't be available until Sublime Text has been restaarted`
