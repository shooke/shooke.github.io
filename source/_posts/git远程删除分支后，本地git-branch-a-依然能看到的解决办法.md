---
title: git远程删除分支后，本地git branch -a 依然能看到的解决办法
date: 2019-01-29 14:28:10
categories:
- 开发工具
tags:
- git
---
git远程删除分支后，本地`git branch -a` 依然能看到的解决办法很简单，使用`git remote prune origin`就可以解决了。下面详细说明
<!-- more -->
使用`git branch -a`命令可以查看所有本地分支和远程分支（`git branch -r` 可以只查看远程分支） 
发现很多在远程仓库已经删除的分支在本地依然可以看到。
```
  dev
  master
* tb
  remotes/origin/HEAD -> origin/master
  remotes/origin/my-feature #已经被远程删除的分支
```
但是如果使用git push -d origin my-feature,就会报错
```
error: unable to delete 'my-feature': remote ref does not exist
```
使用命令 `git remote show origin`，可以查看remote地址，远程分支，还有本地分支与之相对应关系等信息。
```
* 远程 origin
  获取地址：http://gitee.com/dm/dmp-api.git
  推送地址：http://gitee.com/dm/dmp-api.git
  HEAD 分支：master
  远程分支：
    dev                                      已跟踪
    master                                   已跟踪
    tb                                       已跟踪
    refs/remotes/origin/my-feature           过时（使用 'git remote prune' 来移除）
```
此时我们可以看到那些远程仓库已经不存在的分支，根据提示，使用 `git remote prune origin` 命令：
```
修剪 origin
URL：http://gitee.com/dm/dmp-api.git
 * [已删除] origin/my-feature
```
这时我们运行`git branch -a`就不会看到远程已经别删除的分支了