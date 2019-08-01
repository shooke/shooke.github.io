---
title: telnet使用简介
categories:
  - 
tags:
  - telnet
date: 2019-07-31 22:01:23
---
## 端口不通
```
telnet 192.168.1.100 62715
Trying 192.168.1.100...
telnet: connect to address 192.168.1.100: Connection refused
```
无法接通，自动退出

## 端口开通
```
telnet 192.168.1.100 62715
Trying 192.168.1.100...
Connected to 192.168.1.100.
Escape character is '^]'.
```
链接成功，根据提示`Escape character is '^]'`.可知退出字符为`'^]'`（CTRL+]）。此时输入其它字符不能使其退出，CTRL+C都不行。输入CTRL+]后会自动执行，进入命令模式，屏幕上出现`telnet>`字样。需要输入`quit`才可退出
`Escape character`提示是自定义的，使用参数`-e`即可
```
telnet -e p 192.168.1.100 62715   #使用p字符
Telnet escape character is 'p'.
Trying 192.168.1.100...
Connected to 192.168.1.100.
Escape character is 'p'.
```
输入`p`,会出现`telnet>`字样，输入`quit`可退出

<!-- more -->

## 自动退出
```
echo "" | telnet 192.168.1.100 62715
```
已成功连通端口并自动退出，显示如下信息
```
Trying 192.168.1.100...
Connected to 192.168.1.100.
Escape character is '^]'.
Connection closed by foreign host.  
```
如果端口未开放显示如下信息
```
Trying 192.168.1.100...
telnet: connect to address 192.168.1.100: Connection refused
```

## 延时退出
```
sleep 2 | telnet 192.168.1.100 62715
```
sleep 2使得telnet输出结果后，停留2秒后退出命令模式。

## 参考资料
http://www.linuxidc.com/Linux/2017-06/145164.htm
https://www.linuxprobe.com/chapter-09.html