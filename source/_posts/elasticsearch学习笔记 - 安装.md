---
title: elasticsearch学习笔记 - 安装
categories:
  - elasticsearch
tags:
  - elasticsearch学习笔记
  - elasticsearch
  - es
  - 安装es
date: 2019-03-14 13:30:16
---

最近用到了es，于是从网上找资料，但是好多都过时了，比如type在elasticsearch 6.0开始已经不推荐使用了。联合查询6.x使用的是join类型的字段，也不在支持type之间的联合查询。问什么要取消type呢？官方给出的理由是
> ①，而在我们elasticsearch中同一 Index 下，同名 Field 类型必须相同，即使不同的 Type；
> ②， 同一 Index 下，TypeA 的 Field 会占用 TypeB 的资源（互相消耗资源），会形成一种稀疏存储的情况。尤其是 doc value ，为什么这么说呢？doc value为了性能考虑会保留一部分的磁盘空间，这意味着 TypeB 可能不需要这个字段的 doc_value 而 TypeA 需要，那么 TypeB 就被白白占用了一部分没有半点用处的资源；
> ③，Score 评分机制是 index-wide 的，不同的type之间评分也会造成干扰。
> ④，索引元数据本身是放在主节点中维护的，CP 设计。意味着涉及到大量字段变更及元数据变更的操作，都会导致该 Index 被堵塞或假死。我们应该对这样的 Index 做隔离，避免影响到其他 Index 正常的增删改查。甚至当涉及到字段变更十分频繁且无法预定义 schema 的场景时，是否要使用 ES 都应该慎思熟虑了！

出现这种情况主要是在elasticsearch早期时候提出的一些概念，当时为了便于推广，跟关系型数据库作了如下比喻：

|myql | elasticsearch|
|-----|--------------|
|database|index|
|table|type|
|column|field|

很多学习elasticsearch的人估计都看过这个比喻，但其实这是错误的。elasticsearch是基于 Lucene开发的，而在 Lucene中是没有table概念的，有的只是文档和字段。

<!-- more -->

言归正传开始今天的正题，如何安装elasticsearch。

## 安装java环境
elasticsearch是使用java语言开发的，所以运行需要安装jdk。
1. 下载
先到 https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html 下载jdk然后安装。
我用的压缩包安装，下载`dk-8u201-linux-x64.tar.gz`
2. 安装
将下载的压缩包上传到服务器的`/opt`目录下，然后执行一下命令
```
# tar zxvf dk-8u201-linux-x64.tar.gz
```
解压后，会出现`dk-8u201-linux-x64`文件夹，至于压缩包，如果不想要了可以删除
3. 设置环境变量
```
sudo vi /etc/profile

```
在底部添加以下内容
```
#java
JAVA_HOME=/opt/jdk-10.0.2
JRE_HOME=$JAVA_HOME/jre
PATH=$PATH:$JAVA_HOME/bin
CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export JAVA_HOME
export JRE_HOME
export PATH
export CLASSPATH
```
让配置立刻生效
```
source /etc/profile
```
执行 `java -version` 如果看到java版本提示，表示安装成功了。

> 注意，这里有个坑，ubuntu服务器切换用户后环境变量会丢失。如果你是服务器环境，请参考https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-get-on-debian-8 进行安装

## 安装elasticsearch

安装非常简单，执行一下命令就可以了
```
curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.4.3.tar.gz
tar -xvf elasticsearch-6.4.3.tar.gz
cd elasticsearch-6.4.3/bin
./elasticsearch
```
这样elasticsearch就安装完成并且运行起来了

> 注意，elasticsearch要去不能用root用户运行，如果你是root，可以用如下方法解决
> 1. 在执行elasticSearch时加上参数-Des.insecure.allow.root=true。
> 2. 用vi打开elasicsearch执行文件，在变量ES_JAVA_OPTS使用前添加以下命令 ES_JAVA_OPTS="-Des.insecure.allow.root=true"
> 3. su 切换到其他账号，运行elasticsearch

参考资料
[elasticsearch官方安装说明](https://www.elastic.co/guide/en/elasticsearch/reference/6.4/getting-started-install.html)
[root运行elasticsearch](https://blog.csdn.net/lahand/article/details/78954112)
[阮老师elasticsearch笔记](http://www.ruanyifeng.com/blog/2017/08/elasticsearch.html)
[jdk安装](https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-get-on-debian-8)
[elasticsearch6.0只允许一个type](https://elasticsearch.cn/article/337)

