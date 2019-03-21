---
title: git保存密码
categories:
  - git
tags:
  - git
date: 2019-03-06 10:29:01
---

git每次提交都输入密码，非常麻烦，让它记住密码就好了。一劳永逸的做法是永久保存，这样每次都不用输入密码。但是，这样会有安全问题，如果电脑忘了关机，任何人都可以对其进行操作。最好是让密码有个时效性，当超过了指定时间，密码自动失效。

<!-- more -->



## linux

下面是两种设置方式

- 永久保存
```
git config --global credential.helper cache
```
- 指定保存时间
```
git config --global credential.helper "cache --timeout=3600"
```

## windows

执行命令
```
git config --global credential.helper winstore
```
或者修改配置文件加入下面的代码
```
[credential]
    helper = winstore
```