---
title: linux 为php7.0安装redis扩展
categories:
  - 笔记
tags:
  - php
  - redis
date: 2020-02-12 19:52:59
---

## 先决条件
php一定要有phpzise组件，如果是编译安装一般是有的，如果是apt或yum不一定有。也很简单，安装个php-dev就可以了。
另外gcc等必备的包，安装过程中缺什么就按什么。
笔记以apt安装php环境为基础做记录
## 开始安装
1. 安装扩展
```
wget https://github.com/phpredis/phpredis/archive/4.0.2.tar.gz
tar -zxvf 4.0.2.tar.gz
cd phpredis-4.0.2
./configure --with-php-config=/usr/bin/php-config7.0
make && make install
```
php-config是一个获取php配置的程序，一般在php安装目录的bin目录下。多版本共存的情况下安装扩展可以让扩展准确知道，这是给哪个版本安装。
如果是apt安装的php，可以使用`whereis php-config`查看该文件所在目录。如果是自己编译安装更容易找，到安装目录下的bin目录就找到了。

2. 启用扩展
找到`vi /etc/php/7.0/fpm/php.ini` 在里面添加 `extension=redis.so` 就可以了。
如果想在命令行模式下也使用这个扩展，可以在`/etc/php/7.0/cli/php.ini`里也添加 `extension=redis.so` 。

3. 重启php-fpm和nginx
```
service php-fpm7.0 restart
systemctl restart nginx
```
经过这些处理redis扩展就可以正常使用了。

## 参考资料
https://www.cnblogs.com/eeds-wangwei/p/11016160.html
https://github.com/phpredis/phpredis