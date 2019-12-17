---
title: 2.把项目交给git
categories:
  - 一点一点了解git
tags:
  - git
date: 2019-12-17 10:36:40
---

> 本故事纯属虚构，如有雷同，^0^那可太巧了

小白是公司老员工了，经手的项目一个手已经数不过来了。版本也多的数不胜数。公司电脑上各种文件夹，一看到脑袋就疼。
考察了svn和git后，最后决定使用git进行项目管理。

小白虽然是老程序猿，但无奈以前没了解过git啊。从今天开始就要进入git的世界了。

沐浴更衣，斋戒数天。开始使用git。

打开项目目录，输入神圣的git初始化命令
```
$ git init
Initialized empty Git repository in /home/shooke/learngit/.git/
```
完成了？这么简单？没有报错？小白小激动了一下，git初始化就这么简单？检查一下便知道。查看了一下，项目下果然多了个`.git`文件夹。

接下来我们把项目加入到git代码仓库
```
git add .
git commit -m "init"
```
这样，文件就被git记录下来了。就是这么easy。

不一会小白写好了一个新功能，然后`git add .` `git commit -m "我有完成了一个牛X的功能"`记录下自己的工作。好开心，原来git这么简单，每次做完功能先 `add`然后`commit`就好了。

就这样小白开始了他的git之旅...


## 小结
`git init`可以初始化项目
`git add .`或`git add readme.md`可以将文件暂存，`.`是当前目录的意思，可以将目录下所有文件进行暂存，如果要针对某个文件可以加上文件名如`readme.md`
`git commit -m "init"`将文件加入到git代码仓库，并生成一条`init`的log记录





