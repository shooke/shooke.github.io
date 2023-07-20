---
title: ubuntu18.4多版本php安装
categories:
  - 笔记
tags:
  - php
date: 2021-09-17 09:58:13
---
## 安装php ppa源
```
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:ondrej/php

```
老版本的12.4之前的ubuntu用下面的命令
```
sudo apt-get install python-software-properties
sudo add-apt-repository ppa:ondrej/php
```
## 更新源
```

sudo apt-get update
```

## 安装对应的版本
比如安装7.0
```
sudo apt-get install -y php7.0

```