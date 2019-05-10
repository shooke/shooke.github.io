---
title: ubuntu更新php
categories:
  - 系统运维
tags:
  - php
  - ubuntu
date: 2019-05-10 10:03:38
---

服务器以前安装的 php7.0，最近开发任务中有部分插件，从 composer 安装提示需要 php7.2 的版本，才可以安装。
但是服务器的源里面没有 php7.2，最新的也就 7.0。添加 ppa 搞了一下。记录下步骤

## 安装 ppa 管理器

```
apt-get install software-properties-common
```

如果已经安装了，可以省略这一步，如果不安装，在执行`add-apt-repository`命令时会提示`sudo: add-apt-repository: command not found`

## 添加 ppa 源，并更新源

```
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
```

## 升级 php
```
sudo apt-get upgrade php7.2
```
注意这个命令会连系统一起升级，比较危险建议，先删除程序然后用`apt install php7.2`安装新版
```
sudo apt remove php7.0
sudo apt-get install php7.2
```
