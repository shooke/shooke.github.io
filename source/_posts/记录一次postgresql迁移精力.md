---
title: 记录一次postgresql迁移精力
categories:
  - 笔记
tags:
  - postgresql
date: 2020-09-29 00:24:15
---
数据库服务器硬盘满了，需要将数据迁移到另一台数据库，做一下记录


## 安装
去postgresql官网https://www.postgresql.org/download/，选择操作系统，我这里选择的是ubuntu。
然后根据说明进行安装
```
# Create the file repository configuration:
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import the repository signing key:
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update the package lists:
sudo apt-get update

# Install the latest version of PostgreSQL.
# If you want a specific version, use 'postgresql-12' or similar instead of 'postgresql':
sudo apt-get -y install postgresql
```
值得注意的是，安装时一定要选择与老数据库相同的版本

安装完成后，就可以会自动添加一个postgres的系统用户，该用户没有密码如果想要密码可以自行设置

<!-- more -->

## 登录postgresql，配置密码
刚安装完，一定要使用`postgres`用户才可以登录
```
$ sudo su - postgres
$ psql
psql (9.6.19)
SSL 连接（协议：TLSv1.2，密码：ECDHE-RSA-AES256-GCM-SHA384，密钥位：256，压缩：关闭)
输入 "help" 来获取帮助信息.

postgres=# 
```
出现`postgres=#`标示已经登录到数据库了。非常简单。

`psql`命令其实是相当于`psql -U postgres -h localhost`，因为`psql`如果不指定用户会使用与系统账户相同的数据库账号。
一定要注意哦，系统中的`postgres`和数据库的`postgres`虽然名字一样，但不是一回事一个属于系统，一个数据数据库。
接下来给数据库的`postgres`账号设置密码，这样我们就可以在不切换系统`postgres`账号的情况下登录了。
```
postgres=# alter user postgres with password '123456'
```
这样就设置好了密码。

## 配置外网访问
默认postgresql是不允许外网访问的，我们需要修改两个文件。
1. pg_hba.conf：配置数据库的访问权限
2. postgresql.conf：配置数据库服务的相关参数

首先我们退出数据库
```
postgres=# \q
```
然后切换回root账号
```
su - root
```
接下来修改配置文件，修改`pg_hba.conf`，增加一条`host  all  all  0.0.0.0/0   md5`规则

修改`postgresql.conf` 找到`#listen_addresses=’localhost’`，修改成`listen_addresses=’*’`

修改完成重启服务

```
service postgres restart
```

这样我们就可以在其他电脑上用`psql -h serverip -U postgres`登录数据库管理了

## 修改数据存储位置

1. 首先需要停止服务执行`service postgresql stop`
2. 将原来的数据库目录复制新目录
   打开`postgresql.conf`文件找到`data_directory`看一下当前数据库存放目录

   将目录复制到想保持的地方，不可以使用cp那样会缺少属性，无法启动数据库，需要用`rsync`命令
   ```
   rsync -av /var/lib/postgresql/9.6/main /mnt/main
   ```
  `/var/lib/postgresql/9.6/main`是`data_directory`中个默认的设置，将其修改为新目录`/mnt/main`
3. 重启服务`service postgresql`

这样数据存储位置就生效了

## 导入老数据

执行命令`psql -h localhost -U postgres 数据库名 < 备份文件` 导入数据

