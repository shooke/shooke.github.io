---
title: 省略sudo使用docker
categories:
  - docker
tags:
  - docker
  - sudo
date: 2019-04-25 13:31:43
---

## 安装 docker

```
wget -qO- https://get.docker.com/ | sh
```

或

```
sudo apt install docker
```

## 原理

为什么需要创建 docker 用户组？
Docker 守候进程绑定的是一个 unix socket，而不是 TCP 端口。这个套接字默认的属主是 root，其他是用户可以使用 sudo 命令来访问这个套接字文件。因为这个原因，docker 服务进程都是以 root 帐号的身份运行的。

<!-- more -->

为了避免每次运行 docker 命令的时候都需要输入 sudo，可以创建一个 docker 用户组，并把相应的用户添加到这个分组里面。当 docker 进程启动的时候，会设置该套接字可以被 docker 这个分组的用户读写。这样只要是在 docker 这个组里面的用户就可以直接执行 docker 命令了。
因为该 dockergroup 等同于 root 帐号

## 具体操作
1. 执行以下命令

```
sudo usermod -aG docker your_username
```

2. 退出重新登录，这个很重要。
3. 执行 docker 命令测试以下

```
docker run hello-world
```

## 参考资料

http://www.runoob.com/docker/ubuntu-docker-install.html
http://www.docker.org.cn/book/install/run-docker-without-sudo-30.html
