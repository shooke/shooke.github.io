---
title: git中文文件名乱码解决方法
categories:
  - 笔记
tags:
  - git中文乱码
date: 2019-12-17 11:23:37
---
```
$ git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	Untitled-1
	"git\347\256\200\344\273\213"

nothing added to commit but untracked files present (use "git add" to track)


```
其实`"git\347\256\200\344\273\213"`是个中文名的文件`git简介`,中文部分成了乱码，解决方法很简单
```
git config --global core.quotepath false
```
这样，不对0x80以上的字符进行quote，解决git status/commit时中文文件名乱码