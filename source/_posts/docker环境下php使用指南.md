---
title: docker环境下php使用指南
categories:
  - docker
tags:
  - php
  - php-fpm
  - php-cli
  - docker
date: 2019-05-15 18:09:53
---

最近由于业务原因，需要将 php7.0 升级到 7.2。升级要考虑一下几点
要满足以下需求

1. php7.0 和 7.2 要共存，以免升级 7.2 以后出现问题，及时切换回来。
2. 升级操作要简单，服务器数量比较多，原生方式安装太过复杂，操作步骤太多，就算携程 shell 脚本，维护起来也比较麻烦
3. nginx 保持原样，只对项目相关的配置文件做简单调整即可。如果 nginx 变更日志处理等模块都收到牵连。

考虑到上面的因素，用 docker 显然是非常符合的。于是就开启了踩坑之旅。
主要遇到了两个问题，一个是`502`，还有一个是`File not found`。下面进行分析

<!-- more -->

## 502问题解决

502一看就是nginx跟php的通讯出现了问题。检查原因
1. docker是否正常启动
2. 是都对端口做了映射
```
#docker启动命令
docker run -p 9000:9000 -d --name myphp -v /var/www/html/:/var/www/html/ --privileged=true -d php:7.2-fpm
```
先用`docker container ls`查看是否已经启动容器，如果列表中没有，说明启动失败了
如果容器正常启动，则检查一下端口是否正确。命令中`-p 9000:9000`说明本地端口已经映射到了docker的9000端口。检查nginx中的配置。
原来是代理错了
```
location ~ \.php$ {
  include snippets/fastcgi-php.conf;
  fastcgi_pass unix:/var/run/php/php7.0-fpm.sock;  
}
```
修改`fastcgi_pass`为端口形式，改为如下配置
```
location ~ \.php$ {
  include snippets/fastcgi-php.conf;
  fastcgi_pass 127.0.0.1:9000;
}
```
运行`nginx -s reload`重启成功。这回502问题消失了。


## File not found 问题解决
出现File not found 返回码是404，分析原因
1. 文件路径不对
2. 文件没有权限

首先检查nginx中`root`的配置发现目录是对的，这就排除了nginx报404的可能。然后分析文件权限，发现也是可读的。文件权限正常。
那就只有一种可能了，php-fpm没有找到文件。
nginx和php的组合，是现在很普遍的方式，他的执行过程是这样的
1. nginx接到请求，转发到php-fpm
2. php-fpm接收到数据，启动php，执行php代码

既然nginx设置和权限都没问题，那就说明这个file not found是php报的错，查看docker的log发现真的有错误。
```
project3-php_1     | 172.17.0.5 -  29/Mar/2016:13:29:12 +0000 "GET /index.php" 404
```
php居然找的是根目录下的index.php。这说明docker的卷映射的不对。修改执行命令的`-v`参数，重新启动镜像。重启nginx果然问题解决了。

## 总结
```
docker run -p 9000:9000 -d --name myphp -v /var/www/html/:/var/www/html/ --privileged=true -d php:7.2-fpm
```
其中`-p 9000:9000`和`-v /var/www/html/:/var/www/html/`是关键，这两个一定要注意。
1. -p 宿主机端口:docker端口
因为nginx是在宿主机上的程序，并不能直接访问docker中的端口，只能发送给宿主机9000端口。
`-p 9000:9000`参数会让宿主机把来自9000端口的数据，发送给docker的9000端口。
这样就实现了和docker通信的过程

2. -v 宿主机路径:docker工作路径
注意这里一定要用绝对地址，配置好了卷映射，宿主机路径一定要和nginx虚拟主机root的配置一致。docker才可以读取宿主机的文件。