---
title: deepin编译安装nginx问题总结.md
categories:
  - 笔记
tags:
  - nginx
date: 2020-10-08 22:10:48
---

## c compiler cc is not found

检查是否一安装gcc如果没有，执行`apt install gcc`进行安装
如果已经安装了gcc，但还是包错误，就需要执行`apt install build-essential`

<!-- more -->

## ./configure: error: the HTTP rewrite module requires the PCRE library

遇到这个问题只需要安装pcre就可以了
```
apt install libpcre3 libpcre3-dev
```

##  ./configure: error: the HTTP gzip module requires the zlib library

说明缺少zlib，执行下面的命令安装
```
apt install zlib1g-dev
```

另外openssl也是常用的所以最好也安装一下
```
apt install openssl libssl-dev
```

## 总结

编译nginx之前先做好准备工作,这样就可以安心编译了
```
apt install make gcc libpcre3 libpcre3-dev  zlib1g-dev openssl libssl-dev
```