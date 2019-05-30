---
title: GIT批量删除远程标签
categories:
  - git
tags:
  - git
  - tag
date: 2019-05-30 16:39:29
---

## 查看远程所有标签
```
$ git ls-remote --tags
From git@github0123:jeremy0123/fetch.git
30f4e5cdfef2539b5e156a607f365fb457f309a4        refs/tags/v0.1
0efbfd03ed4b09647ef8a32db9c0a075f7d7dbeb        refs/tags/v0.2
6944954ffa18df994365e53e96d3826a3953890b        refs/tags/v0.2^{}
```
`注意：refs/tags/v0.2^{}表示v0.2是含附注的标签。`
另外，参数--tags可以简化为-t；--heads会获取远程仓库的分支信息。如果没有任何参数，将获取所有的分支和标签信息。

<!-- more -->

## 删除远程标签
```
$ git push origin --delete tag v0.1
```
或
```
git push origin :refs/tags/v0.1
```
## 删除远程所有标签

先获取远程所有标签，然后用`awk`获取所有标签名，再用`sed`去掉带有`^{}`的标签，最后执行用`git push`删除
```
git ls-remote --tags | awk '/(.*)(\s+)(.*)$/ {print ":" $2}' | sed '/}$/'d |xargs git push origin
```