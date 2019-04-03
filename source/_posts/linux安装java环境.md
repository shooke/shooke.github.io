---
title: linux安装java环境
categories:
  - 系统运维
tags:
  - java
  - jdk
date: 2019-04-03 15:04:54
---
## 下载jdk
可以到https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html下载
JDK 8u201 是稳定版本 
JDK 8u202 是开发版本，包含了8u21的功能和一些其他功能，有可能会有bug 
找到`Java SE Development Kit 8u201`点击该栏目下的`Accept License Agreement`单选项
在下面的列表中找到需要的版本，右键复制链接，在terminal里面用`wget`命令下载，下面用的是`jdk-8u201-linux-x64`包
```
wget https://download.oracle.com/otn-pub/java/jdk/8u201-b09/42970487e3af4f5aa5bca3f542482c60/jdk-8u201-linux-x64.tar.gz?AuthParam=1554274626_8750d27ae1e72e03c48aa9f516d713c3
```
## 解压程序包并移动到/opt目录
```
tar zxvf jdk-8u201-linux-x64.tar.gz
sudo mv jdk-8u201-linux-x64 /opt
```
## 设置环境变量
```
vi ~/.profile
```
在最后加入
```
#java
export JAVA_HOME=/opt/jdk-8u201-linux-x64 #jdk的存放目录
export JRE_HOME=$JAVA_HOME/jre
export PATH=$PATH:$JAVA_HOME/bin
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```
最后让配置生效
```
source ~/.profile
```
运行`java --version`看是否生效