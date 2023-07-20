---
title: ssh提速
categories:
  - 笔记
tags:
  - ssh
date: 2019-12-28 17:31:20
---
最近ssh链接超慢，但是ping发现网速还是很快的。记录一下解决方法
修改`/etc/ssh/sshd_config`两个参数
```
UseDNS no
GSSAPIAuthentication no
```
保存后重启ssh服务
```
systemctl restart sshd
```