---
title: linux使用apt方式安装mysql5.7
categories:
  - 数据库
tags:
  - mysql
date: 2019-03-13 23:13:33
---
安装3步曲：
1. 使用apt-get安装
2. 设置root密码和验证方式
3. 重启服务

<!-- more -->

## 安装

废话少说，开始安装
```
sudo apt-get install mysql-server
sudo apt-get install mysql-client
```

## 设置root密码和验证方式

查看下/etc/mysql/debain.cnf，内容如下

> # Automatically generated for Debian scripts. DO NOT TOUCH!
> [client]
> host     = localhost
> user     = debian-sys-maint
> password = bqDQ42VIUk9zTFFR
> socket   = /var/run/mysqld/mysqld.sock
> [mysql_upgrade]
> host     = localhost
> user     = debian-sys-maint
> password = bqDQ42VIUk9zTFFR
> socket   = /var/run/mysqld/mysqld.sock

用里面的debian-sys-maint用户登录数据库，密码就是password对应的bqDQ42VIUk9zTFFR
```
mysql -u debian-sys-maint -p
```
输入密码，进入mysql，执行一下命令设置root密码
```
update mysql.user set authentication_string=PASSWORD('newPwd'), plugin='mysql_native_password' where user='root';
```
`注意，authentication_string是密码 ，plugin是验证方式，这两个一定要同时改。从mysql5.7开始root的默认验证方式是auth_socket`

## 重启服务
```
service mysql restart
```
可以用mysql -uroot -p登录了