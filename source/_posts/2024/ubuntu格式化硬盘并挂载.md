---
title: ubuntu格式化硬盘并挂载
categories:
  - 笔记
tags:
  - linux
  - ubuntu
date: 2024-05-15 20:06:28
---
```
sudo fdisk -l

sudo fdisk /dev/vdb

```
选择n新建分区，选择p主分区，选择1，回车确认默认起始扇区，回车确认默认结束扇区，输入+200G，回车确认格式化，输入w保存并退出。
```
Welcome to fdisk (util-linux 2.34).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table.
Created a new DOS disklabel with disk identifier 0x29c5f384.

Command (m for help): n
Partition type
   p   primary (0 primary, 0 extended, 4 free)
   e   extended (container for logical partitions)
Select (default p): p
Partition number (1-4, default 1): 
First sector (2048-419430399, default 2048): 
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-419430399, default 419430399): 

Created a new partition 1 of type 'Linux' and of size 200 GiB.

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```
将分区进行格式化
```
sudo mkfs.ext4 /dev/vdb1
```
创建挂载目录，并将分区挂载到目录
```
sudo mkdir /mnt/vdb
sudo mount /dev/vdb1 /mnt/vdb
```
上面挂载是临时的，重启后会失效，需要修改fstab文件，开启自动挂载
```
echo '/dev/vdb1 /mnt/vdb ext4 defaults 0 0' | sudo tee -a /etc/fstab
```
