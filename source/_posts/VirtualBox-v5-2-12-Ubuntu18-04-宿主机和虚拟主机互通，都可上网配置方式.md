---
title: VirtualBox v5.2.12 Ubuntu18.04 宿主机和虚拟主机互通，都可上网配置方式
categories:
  - 笔记
tags:
  - 互通
  - VirtualBox
  - ubuntu
date: 2019-04-02 13:29:28
---

## 全局设置

点击管理，全局设置；
选择网络，里面只有 NAT 网络；
点击添加，列表新增 NatNetwork，点击确定。

## 虚拟机配置

点击管理，选择主机网络管理；
选择创建，列表新增 vboxnet0，只要这一个就够了；
选中点击 vboxnet0，点击手动配置网卡；
点击 IPv4 地址，输入配置的网关 IP，如：192.168.56.1；
如果不想使用 DHCP，取消启用 DHCP，点击应用。

## 给虚拟机添加网卡

右键点击一个虚拟主机，选择设置；
选择网络；
选中点击网卡 1，勾选启用网络连接；
连接方式选择网络地址转换(NAT)，界面可以空着；
选中点击网卡 2，勾选启用网络连接；
连接方式选择仅主机(Host-Only)网络，界面名称为 vboxnet0，点击确认。

<!-- more -->

## 设置虚拟机网络

执行命令

```
sudo vim /etc/network/interfaces
```

如果第二步中启用了 DHCP，可以这样设置

```
source /etc/network/interfaces.d/*

auto lo
iface lo inet loopback

auto enp0s3
iface enp0s3 inet dhcp

auto enp0s8
iface enp0s8 inet dhcp
```

如果第二步中取消了 DHCP 则这样配置

```
source /etc/network/interfaces.d/*

auto lo
iface lo inet loopback

auto enp0s3
iface enp0s3 inet dhcp
# 为第二块网卡配置静态ip
auto enp0s8
iface enp0s8 inet static
address 192.168.56.102
netmask 255.255.255.0
```

注意，有可能网卡名称不是 enp0s8，如果要查看网卡可以执行`ls /sys/class/net`进行查看

## 重启虚拟机测试
注意这里要重启虚拟主机
虚拟主机重启后，先执行`ifconfig`会看到如下信息

```
enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255
        inet6 fe80::a00:27ff:fecb:1016  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:cb:10:16  txqueuelen 1000  (Ethernet)
        RX packets 14  bytes 3390 (3.3 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 27  bytes 3372 (3.3 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

enp0s8: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.56.102  netmask 255.255.255.0  broadcast 192.168.56.255
        inet6 fe80::a00:27ff:fe6f:4edf  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:6f:4e:df  txqueuelen 1000  (Ethernet)
        RX packets 56  bytes 6310 (6.3 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 75  bytes 10073 (10.0 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 88  bytes 6692 (6.6 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 88  bytes 6692 (6.6 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

```

这个`enp0s8`就是我们的 Host-Only 网卡，`inet`就是网卡的 ip 地址，这是显示的是`192.168.56.102`。在宿主机执行

```
ping 192.168.56.102
```

发现 ping 通了。
查看一下宿主机的 ip，在虚拟机中`ping`也可以 ping 通。这样宿主机和虚拟主机的双向通讯就没有问题了。而且宿主机和虚拟机都可以访问外网。
