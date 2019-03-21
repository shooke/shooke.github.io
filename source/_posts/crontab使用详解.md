---
title: crontab使用详解
date: 2019-01-24 09:20:47
categories:
- 系统运维
tags:
- crontab
---
网上有很多关于crontab的介绍，但是没有一份很全面的，例子也不少，但是没有详细解释具体的意义。看下面的例子：
```
#每隔1个小时执行一次  ls
0 */1 * * * ls

#每隔2个小时执行一次 ls
0 */2 * * * ls

#每隔3个小时执行一次 ls
0 */3 * * * ls

#每隔4个小时执行一次 ls
0 */4 * * * ls

#每隔10天执行一次 ls
0 0 */10 * * ls

#每天1点执行 ls
0 1 * * * ls
```
接下来就详细说明一下crontab的使用，和每个参数的意义
<!-- more -->
## 使用crontab
修改计划任务可以用`crontab -e`命令
> crontab -e

查看已有计划任务可以使用`crontab -l`命令
> crontab -l

## 参数的含义
![crontab示意图](/assets/images/posts/crontab.png)

每个参数我们可以使用 \*  、1 、*/1 、1,2、1-3这四种形式
> 星号（ \* ）：代表所有可能的值，例如month字段如果是星号，则表示在满足其它字段的制约条件后每月都执行该命令操作。
> 逗号（ , ）：可以用逗号隔开的值指定一个列表范围，例如，“1,2,5,7,8,9”
> 中杠（ - ）：可以用整数之间的中杠表示一个整数范围，例如“2-6”表示“2,3,4,5,6”
> 正斜线（ / ）：可以用正斜线指定时间的间隔频率，例如“0-23/2”表示每两小时执行一次。同时正斜线可以和星号一起使用，例如*/10，如果用在minute字段，表示每十分钟执行一次。

## 实例和纠错
网上流传着许多的实例但其中一些是错误的，比如：

```
# 每一小时重启smb 
* */1 * * * /etc/init.d/smb restart
```
表面上看起来是正确的，第二个参数采用了 */1 表示每小时一次，但是看前面的分钟参数却是 * ，那就表示每分钟一次。整个任务的意义就成了，每隔小时每分钟一次，都每分钟一次了，小时还有什么意义呢？正确的写法应该是什么呢？应该是这样的：
```
# 每小时的第0分钟重启
0 */1 * * * /etc/init.d/smb restart
```
差别就在于指定了分钟，但是这样会有一个新的问题，比如当前时间是09:01，那这个任务会在10:00的时候被执行，要等将近一小时啊，好痛苦。如果我们希望立刻执行应该怎么做呢？
```
# 每小时重启一次
*/60 * * * * /etc/init.d/smb restart
```
这才是正确的写法，每隔60分钟执行一次命令，并且是立刻执行。

## 练习
```
# 每星期六的晚上11:00 pm重启smb 
0 23 * * 6 /etc/init.d/smb restart

# 晚上11点到早上7点之间，每隔一小时重启smb
*/60 23-7 * * * /etc/init.d/smb restart

# 每月的4号与每周一到周三的11点重启smb 
0 11 4 * mon-wed /etc/init.d/smb restart

# 一月一号的4点重启smb
0 4 1 jan * /etc/init.d/smb restart
```
## crond服务

设置了crontab为什么没有立刻执行呢？如果想立刻生效，最好是重启一下cron服务，常用命令如下

> service cron start    //启动服务
> service cron stop     //关闭服务
> service cron restart  //重启服务
> service cron reload   //重新载入配置

参考资料
[http://man.linuxde.net/crontab](http://man.linuxde.net/crontab)
[https://blog.csdn.net/liu0808/article/details/80668705](https://blog.csdn.net/liu0808/article/details/80668705)