---
title: ubuntu18.4 打开文件中文乱码问题解决
categories:
  - 笔记
tags:
  - 中文乱码
date: 2020-12-18 15:46:40
---

本次记录针对ubuntu英文版，打开带有中文字符的文件是，显示乱码问题。不是给ubuntu系统切换到中文版。切换系统语言参考https://blog.csdn.net/qq_36588424/article/details/109617096

## 检查语言环境

出现乱码的原因其实是字符集问题。首先使用`locale`查看当前语言环境。
```
# locale
LANG=en_US
LANGUAGE=
LC_CTYPE="en_US"
LC_NUMERIC="en_US"
LC_TIME="en_US"
LC_COLLATE="en_US"
LC_MONETARY="en_US"
LC_MESSAGES="en_US"
LC_PAPER="en_US"
LC_NAME="en_US"
LC_ADDRESS="en_US"
LC_TELEPHONE="en_US"
LC_MEASUREMENT="en_US"
LC_IDENTIFICATION="en_US"
LC_ALL=

```

<!-- more -->

## 安装utf8字符集

发现没有`utf-8`的字符集。需要安装一下
```
locale-gen en_US.UTF-8
```
查看一下可用字符集，看里面有没有`en_US.UTF-8`
```
# locale -a
C
C.UTF-8
en_US
en_US.iso88591
en_US.utf8
POSIX

```

## 修改`/etc/profile`

用vi打开`/etc/profile`,最后添加`export LC_ALL=en_US.UTF-8`
或者简单点，用下面的命令

```
# echo "export LC_ALL=en_US.UTF-8" >> /etc/profile
# source /etc/profile
```


## 参考资料

https://www.jianshu.com/p/81c1680a583b