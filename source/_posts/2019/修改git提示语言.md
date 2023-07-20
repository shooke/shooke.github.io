---
title: deepin修改git提示语言
categories:
  - 笔记
tags:
  - git语言
date: 2019-12-17 11:13:17
---
deepin系统很好用，汉化也很彻底，安装git后。提示都是中文。不过不太习惯。还是改成英文比较顺眼。
修改`~/.bashrc`文件加入
```
# Set Git language to English
#alias git='LANG=en_US git'
alias git='LANG=en_GB git'
```
关闭命令行，重新打开，如如git命令就会提示英文了