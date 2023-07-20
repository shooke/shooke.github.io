---
title: shadowsocks-deepin pac模式失效问题解决方案
categories:
  - 笔记
tags:
  - shadowsocks-deepin
  - pac
  - shadowsocks
  - 科学上网
date: 2019-06-24 10:37:50
---

今天发现无法访问google了，登上服务器看了下没有链接。查看了下本机shadowsocks-deepin是正常启动的。
再看代理模式是pac。改成全局模式居然可以正常访问google了。问题原因就发生在pac上了。
试着访问了一下`http://file.lolimay.cn/autoproxy.pac`果然无法访问了。
在网上找了一个新的pac配置修改上，真的可以了。目前有效地址`https://prudent-travels.000webhostapp.com/pac.php?a=SOCKS5&b=127.0.0.1:1080`。

我用的`deepin`系统其他系统的修改方式可能有差别。具体操作如下：

<!-- more -->

1. 找到`shadowsocks-deepin`的配置文件`/home/shooke/.config/pikachu/shadowsocks-deepin/gui-config.json`
2. 将`"pacUrl": "http://file.lolimay.cn/autoproxy.pac"`修改为`"pacUrl": "https://prudent-travels.000webhostapp.com/pac.php?a=SOCKS5&b=127.0.0.1:1080"`
3. 右键小飞机图标-》系统代理模式-》pac模式

如果你的小飞机没有bug，应该可以正常访问google了，我的有问题，不知道为什么每次设置，都会编程`http://file.lolimay.cn/autoproxy.pac`，可能是作者忘了读取配置，将pac写死到了代码里。代码是没法改了，自己再配置一下代理就可以了。
**每次重启都需要执行下面的步骤**

4. 打开控制中心-》网络-》系统代理-》自动，将配置URL改为`https://prudent-travels.000webhostapp.com/pac.php?a=SOCKS5&b=127.0.0.1:1080`

这样就可以正常访问google了。