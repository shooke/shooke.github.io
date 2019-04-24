---
title: su 与 su - 的区别
categories:
  - linux笔记
tags:
  - linux
  - su
date: 2019-04-24 22:14:49
---

```
su root
su - root
```

两条命令输入密码后（这里输入的是 root 的密码而不是当前用户的密码），会切换到 root。

## su root

只会切换账号，但 shell 还是原有用户的，目录不会切换，环境变量也不会还，与使用 sudo 执行命令差不多。

## su - root

会彻底切换账户，目录会切换到/root 目录，并且环境变量也是 root 的。相当于使用 root 做了登录
