---
title: Supervisord管理进程常用命令
categories:
  - 系统运维
tags:
  - supervisord
date: 2019-04-28 18:13:49
---
Supervisord安装完成后有两个可用的命令行supervisor和supervisorctl，命令使用解释如下：

**supervisord**: 初始启动Supervisord，启动、管理配置中设置的进程。
**supervisorctl stop programxxx**: 停止某一个进程(programxxx)，programxxx为[program:chatdemon]里配置的值，这个示例就是chatdemon。
**supervisorctl start programxxx**: 启动某个进程
**supervisorctl restart programxxx**: 重启某个进程
**supervisorctl stop groupworker**: 重启所有属于名为groupworker这个分组的进程(start,restart同理)
**supervisorctl stop all**: 停止全部进程，注：start、restart、stop都不会载入最新的配置文件。
**supervisorctl reload**: 载入最新的配置文件，停止原有进程并按新的配置启动、管理所有进程。
**supervisorctl update**: 根据最新的配置文件，启动新配置或有改动的进程，配置没有改动的进程不会受影响而重启。
>注意：显示用stop停止掉的进程，用reload或者update都不会自动重启。

原文https://feilong.me/2011/03/monitor-processes-with-supervisord
