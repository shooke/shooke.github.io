---
title: mysql主从配置
categories:
  - 笔记
tags:
  - mysql
date: 2019-02-21 15:44:58
---

本教程配置是mysql5.7 不同的版本配置方式有差异，仅供参考

## Master的配置

### 修改配置
修改/etc/mysql/mysql.conf.d/mysqld.cnf（配置文件具体位置根据）

```
[mysqld]
log-bin=mysql-bin
server-id=2
binlog-ignore-db=information_schema
binlog-ignore-db=cluster
binlog-ignore-db=mysql
binlog-do-db=test
```
这里的server-id用于标识唯一的数据库，在从库必须设置为不同的值。

binlog-ignore-db：表示同步的时候忽略的数据库

binlog-do-db：指定需要同步的数据库

配置完成后重启mysql服务

<!-- more -->

### 增加同步用户

```
# 添加用户
mysql> create user 'repl'@'172.16.99.44' identified by 'RepL@)18';
# 给用户全局同步权限
mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'172.16.99.44';
# 给用户操作主库的所有权限
mysql> GRANT ALL ON `test`.* TO `test`@`%`
# 刷新权限，让权限生效
mysql> flush privileges;
```
值得注意的一点是上面3条命令一条也不能少，如果只给了全局权限，不分配数据库权限也是无法同步的。
全局权限要根据实际情况给，如果你是用python，获取binlog，那还需要给定REPLICATION CLIENT才可以，否则无法链接数据库。有时候也需要file权限，否则无法读取binlog文件，从库无法同步。

### 看配置是否生效
重启mysql，然后登录mysql，执行如下命令看配置是否生效，如果显示了主库信息标示生效了，如果没有则表示，配置没成功。
```
mysql> show master status;
```
注意一下file和position，在配置从库时会用到。File是同步会使用到的binlog文件，Position是同步的时候也要用到的。

## Slave的配置

### 修改配置
修改/etc/mysql/mysql.conf.d/mysqld.cnf（配置文件具体位置根据）

```
log-bin=mysql-bin
server-id=3
binlog-ignore-db=information_schema
binlog-ignore-db=cluster
binlog-ignore-db=mysql
replicate-do-db=test
replicate-ignore-db=mysql
log-slave-updates
slave-skip-errors=all
slave-net-timeout=60 
```
server-id一定不要和主库相同
replicate-do-db是要同步的数据库，一定要设置正确

配置完成，重启mysql服务

### 配置主从关联
```
mysql> stop slave;
mysql> change master to master_host='192.168.0.68',master_user='RepL',master_password='RepL@)18',master_log_file='mysql-bin.000004', master_log_pos=28125;
mysql> start slave;
```
注意：上面的master_log_file是在Master中show master status显示的File，

而master_log_pos是在Master中show master status显示的Position。

然后可以通过show slave status查看配置信息。

如果没有同步成功，请查看show slave status中的position和file是否和master中的对应了。

查看从库状态
```
mysql> show slave status \G;
```
观察这两个值，Slave_IO_Running: Yes 和Slave_SQL_Running: Yes，如果都是yes，说明运行正常。