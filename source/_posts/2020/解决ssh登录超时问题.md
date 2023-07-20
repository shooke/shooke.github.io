---
title: 解决ssh登录超时问题
categories:
  - 笔记
tags:
  - ssh
date: 2020-09-30 23:36:31
---
加上`-o ServerAliveInterval=60`参数就可以了
```
ssh -o ServerAliveInterval=60 root@192.168.1.1
```