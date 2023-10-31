---
title: mysql log迁移
date: 2023-10-30 19:40:18
tags: mysql
---
记录一次mysql log迁移经理

系统：Ubuntu18.04.6 
mysql版本：mysql5.7

## 停止mysql服务
```
systemctl stop mysql.service
```
## 复制文件到新目录
```
sudo mkdir /data/log/mysql
sudo chown mysql:adm /data/log/mysql
sudo cp /var/log/mysql/* /data/log/mysql
```
## 修改配置文件`/etc/mysql/mysql.conf.d/mysqld.cnf`,找到log的相关的配置修改目录
```
log_error = /data/log/mysql/error.log
slow_query_log_file     = /data/log/mysql/mysql-slow.log
log_bin                 = /var/log/mysql/mysql-bin.log
```
## 修改启动文件`/etc/apparmor.d/usr.sbin.mysqld`添加以下配置
```
/data/log/mysql.err rw,
/data/log/mysql.log rw,
/data/log/mysql/ r,
/data/log/mysql/** rw,
```
## 重启服务
```
systemctl restart apparmor
systemctl start mysql.service
```