---
title: 团队开发中如何使用git分支
categories:
  - 笔记
tags:
  - git
  - 分支
  - 多人协作
date: 2019-02-15 16:57:50
---

git已经成为团队代码管理的标配，合理的使用git分支进行开发，可以大大提高开发效率，降低管理成本。好多人听过git fllow，但都是一知半解，其实并不神秘，也很简单。这是很多研发团队总结出来的一种分支策略而已。

<!-- more -->

## 功能分支使用策略
首先，我们有两个环境，测试环境（dev分支）和生产环境（master分支）。
其次，有两个团队同时进行开发两个不同的功能模块，这两个模块是相对独立的。

开发前，两个团队要在master的基础上创建不同的功能分支，团队一使用branch-1，团队二使用branch-2。

当需要测试时，团队需要将功能分支合并到测试分支dev，线上构建后，开始测试。比如团队1的功能需要测试了，就将branch-1的代码合并到dev，团队二需要测试了将branch-2合并到dev，**这里的合并用merge**。这样两个团队都可以进行测试，互不影响。

其中一个功能完成后，比如branch-1，将其合并到master**(这里合并用merge)**进行发布就可以了。

## 多人合作分支使用策略
上面说道了branch-1和branch-2是功能分支，由两个团队负责，每个团队都有若干个人，这时候就需要考虑团队合作问题。
以团队1为例，团队中的每个人，都应该基于branch-1去checkout一个自己的个人分支，进行开发。
```
git checkout branch-1
git checkout -b mybranch #创建自己的分支
...
git add .
git commit -m "开发说明"
```
当自己的开发完成后，将代码合并到功能分支，可以简单的使用下面的方式。
```
git checkout branch-1 # 切换到功能分支
git pull              # 拉取最新代码
git merge mybranch    # 合并个人代码
git push              # 上传功能分支
```
更好的方式是利用rebase让合并历史更加清晰，方便维护，如下：
```
git checkout branch-1 # 切换到功能分支
git pull              # 拉取最新代码
git checkout mybranch # 切换到个人分支
git rebase branch-1   # 合并功能分支的代码，这个可以让你的分支历史更加清晰，易于管理
git checkout branch-1 # 切换到功能分支
git merge mybranch    # 将个人分支的修改合并进来
git push              # 上传功能分支
```
