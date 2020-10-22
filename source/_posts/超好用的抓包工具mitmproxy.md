---
title: 超好用的抓包工具mitmproxy
categories:
  - 笔记
tags:
  - mitmproxy
date: 2020-10-22 18:25:31
---
mitmproxy是一个非常好用的代理工具

## 安装
最快速的安装莫过于执行
```
sudo apt install mitmproxy

```
由于mitmproxy是基于python开发的，所以安装mitmproxy的同时，也会自动安装上python3。

如果本地已经有了python3.6以上的版本，可以用pip进行安装
```
pip install mitmproxy
```

## 常用命令
要启动 mitmproxy 用 mitmproxy、mitmdump、mitmweb 这三个命令中的任意一个即可，这三个命令功能一致，且都可以加载自定义脚本，唯一的区别是交互界面的不同。
mitmproxy默认监听端口是8080

- mitmproxy 命令启动后，会提供一个命令行界面，用户可以实时看到发生的请求，并通过命令过滤请求，查看请求数据。

- mitmweb 命令启动后，会提供一个 web 界面，用户可以实时看到发生的请求，并通过 GUI 交互来过滤请求，查看请求数据。

- mitmdump 命令启动后——你应该猜到了，没有界面，程序默默运行，所以 mitmdump 无法提供过滤请求、查看数据的功能，只能结合自定义脚本，默默工作

## 场景举例
比如想要对手机内容进行抓包。
要确保电脑和手机在一个wifi网络内，以小米手机为例，长安wifi，进入wifi详情，设置代理，选择手动，主机名设置为电脑的ip，端口号设置为8080（mitmproxy默认监听端口）。点击右上角的对号。保存网络设置就可以了。
电脑执行mitmproxy或mitmweb命令。就可以看到手机的每一次网络请求了。

## 参考资料
详细介绍 https://blog.wolfogre.com/posts/usage-of-mitmproxy/
mitmproxy 官方文档：https://docs.mitmproxy.org/stable/
mitmproxy 脚本示例：https://github.com/mitmproxy/mitmproxy/tree/master/examples
维基百科 - 代理服务器：https://zh.wikipedia.org/wiki/代理服务器