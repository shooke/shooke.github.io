---
title: mysql root用户增加超级权限，解决无法给新建用户配置权限问题
categories:
  - 笔记
tags:
  - mysql
date: 2023-08-20 19:06:28
---
mysql root用户通过外网登录数据库后，想要添加用户分配权限，结果发现不行。但是在服务器上通过localhost登录后可以配置。

原因是新增的`root@%`没有超级权限。只有个`root@localhost`才有。

解决方法是，使用`root@localhost`账户为`root@%`添加超级权限。

在服务器上使用`mysql -u root -p`登录，然后执行以下命令
```
UPDATE mysql.user SET Grant_priv='Y', Super_priv='Y' WHERE User='root';
FLUSH PRIVILEGES;
```
这是通过mysql客户端工具，使用外网链接数据库就可以设置用户权限了