---
title: deepin双内核管理
categories:
  - 笔记
tags:
  - deepin
date: 2021-06-30 23:55:44
---
## 如何手动安装双内核：

深度操作系统内核版本，会以一定周期进行更新，已经安装系统的用户，需要安装最新的内核版本，可通过在[终端]应用中输入命令行操作。

### 安装LTS内核
```
sudo apt install linux-image-deepin-amd64 linux-headers-deepin-amd64
```
### 安装stable内核
```
sudo apt install linux-image-deepin-stable-amd64 linux-headers-deepin-stable-amd64
```
### 查询当前系统已安装内核并获取完整包名：
```
dpkg -l | grep "linux-image\|linux-headers"
```
### 卸载其中一个内核
```
sudo apt purge linux-image-5.10.18-amd64-desktop linux-headers-5.10.18-amd64-desktop
```