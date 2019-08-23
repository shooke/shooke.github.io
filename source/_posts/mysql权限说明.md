---
title: mysql权限说明
categories:
  - 笔记
tags:
  - mysql
  - 权限
date: 2019-03-06 13:23:15
---

关于mysql的权限简单的理解就是mysql允许你做你权利以内的事情，不可以越界。比如只允许你执行select操作，那么你就不能执行update操作。只允许你从某台机器上连接mysql，那么你就不能从除那台机器以外的其他机器连接mysql。

那么Mysql的权限是如何实现的呢？这就要说到mysql的两阶段验证，下面详细介绍：
第一阶段：服务器首先会检查你是否允许连接。因为创建用户的时候会加上主机限制，可以限制成本地、某个IP、某个IP段、以及任何地方等，只允许你从配置的指定地方登陆。
第二阶段：如果你能连接，Mysql会检查你发出的每个请求，看你是否有足够的权限实施它。比如你要更新某个表、或者查询某个表，Mysql会查看你对哪个表或者某个列是否有权限。再比如，你要运行某个存储过程，Mysql会检查你对存储过程是否有执行权限等。

<!-- more -->
## MySQL权限简单分类

数据权限分为：库、表和字段三种级别
管理权限主要是管理员要使用到的权限，包括：数据库创建，临时表创建、主从部署、进程管理等
程序权限主要是触发器、存储过程、函数等权限。

| 权限分布 | 可设置的权限 |
|---------|---------------|
| 表权限 |'Select', 'Insert', 'Update', 'Delete', 'Create', 'Drop', 'Grant', 'References', 'Index', 'Alter'|
|列权限|'Select', 'Insert', 'Update', 'References'|
|过程权限|'Execute', 'Alter Routine', 'Grant'|

## MySQL用户权限层级

- 全局层级：全局权限适用于一个给定MySQL Server中的所有数据库，这些权限存储在mysql.user表中。
```
GRANT ALL ON *.* TO 'user'@'host';  # *.* 表示数据库库的所有库和表，对应权限存储在mysql.user表中
```

- 数据库层级：数据库权限适用于一个给定数据库中的所有目标，这些权限存储在mysql.db表中。
```
GRANT ALL ON mydb.* TO 'user'@'host';  #mydb.* 表示mysql数据库下的所有表，对应权限存储在mysql.db表中
```

- 表层级：表权限适用于一个给定表中的所有列，这些权限存储在mysql.tables_priv表中。
```
GRANT ALL ON mydb.mytable TO 'user'@'host';  #mydb.mytable 表示mysql数据库下的mytable表，对应权限存储在mysql.tables_priv表
```

- 列层级：列权限使用于一个给定表中的单一列，这些权限存储在mysql.columns_priv表中。
```
GRANT ALL (col1， col2， col3)  ON mydb.mytable TO 'user'@'host'; #mydb.mytable 表示mysql数据库下的mytable表， col1, col2,  col3表示mytable表中的列名
```

- 子程序层级：CREATE ROUTINE、ALTER ROUTINE、EXECUTE和GRANT权限适用于已存储的子程序。这些权限可以被授予为全局层级和数据库层级。而且，除了CREATE ROUTINE外，这些权限可以被授予子程序层级，并存储在mysql.procs_priv表中。
```
GRANT EXECUTE ON PROCEDURE mydb.myproc TO 'user'@'host'; #mydb.mytable 表示mysql数据库下的mytable表，PROCEDUR表示存储过程
```

## Mysql权限总览

| **权限** | **权限级别** | **权限说明** |
| ------- | ------- | ------- |
|  CREATE | 数据库、表或索引 | 创建数据库、表或索引权限 | 
|  DROP | 数据库或表 | 删除数据库或表权限 | 
|  GRANT OPTION | 数据库、表或保存的程序 | 赋予权限选项 | 
|  REFERENCES | 数据库或表
|  ALTER | 表 | 更改表，比如添加字段、索引等 | 
|  DELETE | 表 | 删除数据权限 | 
|  INDEX | 表 | 索引权限 | 
|  INSERT | 表 | 插入权限 | 
|  SELECT | 表 | 查询权限 | 
|  UPDATE | 表 | 更新权限 | 
|  CREATE VIEW | 视图 | 创建视图权限 | 
|  SHOW VIEW | 视图 | 查看视图权限 | 
|  ALTER ROUTINE | 存储过程 | 更改存储过程权限 | 
|  CREATE ROUTINE | 存储过程 | 创建存储过程权限 | 
|  EXECUTE | 存储过程 | 执行存储过程权限 | 
|  FILE | 服务器主机上的文件访问 | 文件访问权限 | 
|  CREATE TEMPORARY TABLES | 服务器管理 | 创建临时表权限 | 
|  LOCK TABLES | 服务器管理 | 锁表权限 | 
|  CREATE USER | 服务器管理 | 创建用户权限 | 
|  PROCESS | 服务器管理 | 查看进程权限 | 
|  RELOAD | 服务器管理 | 执行flush-hosts, flush-logs, flush-privileges, flush-status, flush-tables, flush-threads, refresh, reload等命令的权限 | 
|  REPLICATION CLIENT | 服务器管理 | 复制权限 | 
|  REPLICATION SLAVE | 服务器管理 | 复制权限 | 
|  SHOW DATABASES | 服务器管理 | 查看数据库权限 | 
|  SHUTDOWN | 服务器管理 | 关闭数据库权限 | 
|  SUPER | 服务器管理 | 执行kill线程权限 | 

参考资料https://yq.aliyun.com/articles/640817#