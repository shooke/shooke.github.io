---
title: ubuntu 18.04 Temporary failure in name resolution DNS解析问题，解决方法
categories:
  - 笔记
tags:
  - ubuntu
  - dns
date: 2021-09-15 15:47:12
---

在ubuntu18.04 配置环境，发现无法下载网络资源，但是用ip可以访问外网资源。问题应该是dns没有解析。
试了好多种方法无效，最后找到了解决方法，记录一下

修改`/etc/systemd/resolved.conf`将里面的dns注释去掉，配置上自己的dns就可以了
```
[Resolve]
DNS=114.114.114.114
```
注意：修改完成后，需要重启一下服务器