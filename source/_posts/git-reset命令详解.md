---
title: git reset命令详解
categories:
  - 笔记
tags:
  - git
  - git reset
date: 2019-03-06 14:06:21
---

git reset命令，非常牛的一个命令，这个命令可以让你时光穿梭回到过去。用在自己分支上很好用，但是千万不要在公共分支上使用。以免造成历史混乱，破坏历史可是重罪，别看那些穿越小说混的风生水起，那都是骗人的。

用git reset之前先要了解几个概念

- HEAD
这是当前分支版本顶端的别名，也就是在当前分支你最近的一个提交，也就是本地仓库，即你的commit记录

- Index
index也被称为staging area，即add的记录

- Working Copy
working copy代表你正在工作的那个文件

<!-- more -->

## 操作实例

先执行git log查看当前的记录，这里是我预先做了几次commit

```
commit fd9b11185a41cf5cfe187be61dc43c06dd7b5420
Author: shooke <xingjiehu@163.com>
Date:   Fri Feb 24 15:23:55 2017 +0800

    3

commit 0aa75d4355211a8b1943d1c8d5b4904e18053bcf
Author: shooke <xingjiehu@163.com>
Date:   Fri Feb 24 15:23:37 2017 +0800

    2

commit 2bdd42d126d269688be33759f96e4015a85e720b
Author: shooke <xingjiehu@163.com>
Date:   Fri Feb 24 15:23:04 2017 +0800

    1

```
当前工作区是干净的，下面执行以下命令

### --soft
```
shooke@shooke-pc:/var/www/gittest$ git status
位于分支 master
无文件要提交，干净的工作区
shooke@shooke-pc:/var/www/gittest$ git reset --soft HEAD~1
shooke@shooke-pc:/var/www/gittest$ git log
commit 0aa75d4355211a8b1943d1c8d5b4904e18053bcf
Author: shooke <xingjiehu@163.com>
Date:   Fri Feb 24 15:23:37 2017 +0800

    2

commit 2bdd42d126d269688be33759f96e4015a85e720b
Author: shooke <xingjiehu@163.com>
Date:   Fri Feb 24 15:23:04 2017 +0800

    1
shooke@shooke-pc:/var/www/gittest$ git status
位于分支 master
要提交的变更：
  （使用 "git reset HEAD <文件>..." 以取消暂存）

	修改：     a.txt


```
我们发现使用git reset --soft后我们的commit少了一条，a.txt是已经add过的状态
也就是说--soft只是撤销了commit。**但是a.txt的内容是没有改变的。**我们用公式标示一下

>`HEAD` != `index` = `Working Copy`  
**只撤销了commit ，保留了index（add过）和工作区**

### --mixed
我们恢复到3条记录的状态，继续看下面的操作

```
shooke@shooke-pc:/var/www/gittest$ git reset --mixed HEAD~1
重置后取消暂存的变更：
M	a.txt
shooke@shooke-pc:/var/www/gittest$ git log
commit 0aa75d4355211a8b1943d1c8d5b4904e18053bcf
Author: shooke <xingjiehu@163.com>
Date:   Fri Feb 24 15:23:37 2017 +0800

    2

commit 2bdd42d126d269688be33759f96e4015a85e720b
Author: shooke <xingjiehu@163.com>
Date:   Fri Feb 24 15:23:04 2017 +0800

    1
shooke@shooke-pc:/var/www/gittest$ git status
位于分支 master
尚未暂存以备提交的变更：
  （使用 "git add <文件>..." 更新要提交的内容）
  （使用 "git checkout -- <文件>..." 丢弃工作区的改动）

	修改：     a.txt

修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）

```

我们发现git提示我们需要add，也就是说暂存区发生了修改，**但是a.txt 的内容没有改变**
我们再用公式标示一下

>`HEAD` = `index` ！= `Working Copy`  
**撤销了commit 、index，工作区不变**

### --hard

我们恢复到3条记录的状态，继续看下面的操作

```
shooke@shooke-pc:/var/www/gittest$ git reset --hard HEAD~1
HEAD 现在位于 0aa75d4 2
shooke@shooke-pc:/var/www/gittest$ git log
commit 0aa75d4355211a8b1943d1c8d5b4904e18053bcf
Author: shooke <xingjiehu@163.com>
Date:   Fri Feb 24 15:23:37 2017 +0800

    2

commit 2bdd42d126d269688be33759f96e4015a85e720b
Author: shooke <xingjiehu@163.com>
Date:   Fri Feb 24 15:23:04 2017 +0800

    1
shooke@shooke-pc:/var/www/gittest$ git status
位于分支 master
无文件要提交，干净的工作区

```
这一次没有a.txt有修改。也就是说工作区的文件与暂存去、本地仓库是一致的。打开a.txt发现里面的内容变成了2，也就是说**a.txt内容也跟着回退到了上次commit时的代码**。用公式表示

>`HEAD` = `index` = `Working Copy`  
**commit 、index和工作区文件都回退改变**