---
title: 1.docker基础概念
categories:
  - 一点一点了解docker
tags:
  - docker
date: 2020-03-03 09:44:21
---
## docker介绍
Docker 是一个开源的应用容器引擎，基于 Go 语言 并遵从 Apache2.0 协议开源。

Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

容器是完全使用沙箱机制，相互之间不会有任何接口（类似 iPhone 的 app）,更重要的是容器性能开销极低。

Docker 从 17.03 版本之后分为 CE（Community Edition: 社区版） 和 EE（Enterprise Edition: 企业版）。

社区办免费使用。企业版由公司支持，可在经过认证的操作系统和云提供商中使用，并可运行来自Docker Store的、经过认证的容器和插件。

<!-- more -->

## 基本概念
学习docker之前，需要先了解一下docker的几个基本概念：

镜像（Image）：Docker 镜像（Image），就相当于是一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。
容器（Container）：镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
仓库（Repository）：仓库可看着一个代码控制中心，用来保存镜像。

这是比较官方的解释，看起来比较绕口。咱们换种容易理解的方式。安装过系统的人都知道，安装系统需要iso文件。
`镜像就好比iso文件，容器就好比咱们在虚拟机里安好的系统，仓库就好比你下载iso的网站。`上面有好多iso文件哦。

## 安装
在mac和windows上有ui程序，可以从界面管理docker。在docker官方下载即可https://hub.docker.com/search?q=&type=edition&offering=community&sort=updated_at&order=desc。下面介绍一下linux下的安装。
我用的是deepin，所以就以ubuntu的按装为例

1. 删除老版本（如果你以前安装过docker的话）
```
sudo apt-get remove docker docker-engine docker.io containerd runc
```

2. 安装新版docker

```
# 更新数据源
sudo apt-get update
# 安装apt插件
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
# 安装GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
# 验证指纹秘钥
sudo apt-key fingerprint 0EBFCD88

# 增加apt源
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
# 开始安装
sudo apt-get update && sudo apt-get install docker-ce docker-ce-cli containerd.io
 
```
安装完成后可以运行`sudo docker run hello-world`验证是否安装成功

## 参考资料
https://docs.docker.com/install/linux/docker-ce/ubuntu/ 其他系统的安装也可以在这里找到
