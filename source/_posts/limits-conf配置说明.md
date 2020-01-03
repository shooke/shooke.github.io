---
title: limits.conf配置说明
categories:
  - 笔记
tags:
  - elasticsearch
  - limits.conf
date: 2020-01-03 17:30:52
---

最近发生了奇怪的事情，mysql总是会连不上，查了半天原因，最后发现进程文件没有生成。es报警“Too many open files”。搜索才发现是，打开文件太多了，超过了限制。解决方法是修改`/etc/security/limits.conf`。另外还牵扯到了另一个配置`file-max`。经过调试还是踩了不少坑的。坐下笔记，防止重复踩坑。

<!-- more -->

## limits.conf 和 file-max的关系
这两个配置都是为了限制系统资源，防止造成资源耗尽。
一般如果遇到文件句柄达到上限时，会碰到"Too many open files"或者Socket/File: Can’t open so many files等错误。
limits.conf是用户级别的配置，它可以针对每个用户进行限制。
file-max是系统级别的配置，它会限制所有用户的打开句柄总数。

file-max无法限制limits.conf。因为linux是多用户系统。比如 file-max设置100，limits设置是10，如果服务器有11个用户，每个用户设置是10，他们所有人占用的句柄总数加起来有可能超过file-max。

## file-max设置
查看file-max限制，我们可以查看`/proc/sys/fs/file-max`文件
```
cat /proc/sys/fs/file-max
```
修改file-max限制，需要修改`/etc/sysctl.conf`，找到file-max配置进行修改就可以了
```
vi /etc/sysctl.conf
```
末尾加入`fs.file-max = 2000000`如有了`fs.file-max`直接修改值即可。

> 修改后需要重启电脑才会生效，如果要历史修改可以直接修改`/proc/sys/fs/file-max`文件内的值，如果可以的话。我测试的时候没有修改成功

## limits.conf设置

limits的限制可以分为shell级别和系统级别。shell级别顾名思义，只针对当前会话有效。设置方法很简单
### shell级别配置
```
ulimit -n 901
```
查看当前配置也很简单
```
ulimit -n
```
这样就设置好了当前会话的配置。

> 普通用户设置ulimit，每次设置的值只能小于等于上一次设置的值。比如上面设置了901，再次设置只能小于等于901。没有执行ulimit设置之前，配置是从limits.conf文件内读取。因此，每次设置的值不能超过limits.conf文件设置的范围。
。
> root用户不受限制，可以任意设置每次的值

ulimit有一下可选参数

- ulimit -a   显示当前所有的资源限制
- ulimit -H    设置硬件资源限制
- ulimit -S    设置软件资源限制，该限制不能超过`-H`的限制
- ulimit -n    设置进程最大打开文件描述符数

上面的 `ulimit -n 901`相当于 `ulimit -Hn 901` + `ulimit -Sn 901`

### 系统级别配置
`ulimit`好处是配置及时生效，只影响当前shell，安全有保障。但是服务器上我们要配置永久有效，针对所有用户或特定用户有效。就需要配置`limits.conf`文件了。

```
vi /etc/security/limits.conf
```
内容如下
```
* soft nofile 655360        # open files  (-n)，不要设置为unlimited
* hard nofile 655360        # 不要超过最大值1048576，不要设置为unlimited

* soft nproc 655650
* hard nproc 655650         # max user processes   (-u)

hive   - nofile 655650
hive   - nproc  655650

```
格式为`username|@groupname type resource limit`
- `username|@groupname` 设置需要被限制的用户名，组名前面加@和用户名区别。也可以用通配符*来做所有用户的限制。
- `type` soft，hard 和 -，soft是一个警告值，而hard则是一个真正意义的阀值，超过就会报错。soft 的限制不能比har 限制高。用 - 就表明同时设置了 soft 和 hard 的值。
- `resource` 配置项，要使 limits.conf 文件配置生效，必须要确保 pam_limits.so 文件被加入到启动文件中。查看 /etc/pam.d/login 文件中有`session required /lib/security/pam_limits.so`
  - core - 限制内核文件的大小
  - date - 最大数据大小
  - fsize - 最大文件大小
  - memlock - 最大锁定内存地址空间
  - nofile - 打开文件的最大数目
  - rss - 最大持久设置大小
  - stack - 最大栈大小
  - cpu - 以分钟为单位的最多 CPU 时间
  - noproc - 进程的最大数目
  - as - 地址空间限制
  - maxlogins - 此用户允许登录的最大数目
- `limit` 限制的值

> limits.conf 文件修改后退出重新登录一下就生效了，如果不生效就重启下系统

## 常用排查命令
所有用户创建的进程数
```
ps h -Led -o user | sort | uniq -c | sort -n
```
查看系统最大打开文件描述符数
```
cat /proc/sys/fs/file-max
```
设置系统最大打开文件描述符数
```
vim /etc/sysctl.conf
```
查看当前系统使用的打开文件描述符数
```
cat /proc/sys/fs/file-nr
```