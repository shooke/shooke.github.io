---
title: ssh使用详解
categories:
  - 系统运维
tags:
  - ssh
  - 端口转发
date: 2019-06-06 11:06:28
---

ssh命令非常强大，除了登录，还可以实现端口转发，达到代理的作用。

<!-- more -->

## 简单使用
```
ssh -p 22 root@192.168.56.102
```
上面的功能是登录一台服务器，`-p`参数指定端口，ssh默认端口是22，所以上面的命令可以简化为`ssh root@192.168.56.102`

## 远程操作

```
cd && tar czv src | ssh user@host 'tar xz'
```
将本地目录打包后，在远程主机解压。相当于将本地目录复制到远程主机。也可以是用`scp`命令去实现
```
ssh user@host 'tar cz src' | tar xzv
```
将远程主机目录打包后，在本地解压。相当于将远程主机目录下载到本地。也可以使用`scp`命令去实现

## 绑定本地端口
```
ssh -D 8080 user@host
```
上面的命令可以，让本地8080端口的数据，发送到远程服务器。

## 端口转发
上面是个最简单的转发，把本地的请求发往指定服务器，但很多时候网络比较复杂。我们可以使用本地端口转发，或者远程端口转发的方式。


### 1. 本地端口转发
将本地的某个端口绑定，将通过该端口的数据发送到指定的远程主机。
命令格式为
```
ssh -L 本地端口:目标主机:目标主机端口 中转主机
```
如host1是本地主机，host2是远程主机。由于种种原因，这两台主机之间无法连通。但是，另外还有一台host3，可以同时连通前面两台主机。因此，很自然的想法就是，通过host3，将host1连上host2。
在host1执行一下命令
```
ssh -L 2121:host2:21 host3
```
命令分为3部分
1. ssh:指令名称
2. -L 2121:host2:21: `-L`是命令参数，它接收3个值，分别是"本地端口:目标主机:目标主机端口"，它们之间用冒号分隔。这条命令的意思，就是指定SSH绑定本地端口2121，然后指定host3将所有的数据，转发到目标主机host2的21端口（假定host2运行FTP，默认端口为21）。
3. host3：中转主机，host1中发生在2121端口的数据，都会发送到host3，然后由host3进行转发

>数据流向：host1:2121->host3->host2:21

经过上面的设置，只要链接host1的2121端口，就等于链接到了host2的21端口。
```
# host1
ftp localhost:2121
```
"本地端口转发"使得host1和host3之间仿佛形成一个数据传输的秘密隧道，因此又被称为"SSH隧道"

思考一个问题如果执行下面的命令，会是什么效果呢
```
ssh -L 5900:localhost:5900 host3
```
答案是，访问本机5900端口，会被转发到host3的5900端口。这里的`localhost`是已`中转主机`host3的身份来确定的，host3的localhost当然还是host3了。

### 2. 远程端口转发
远程端口转发，和本地端口转发正好相反，他会把远程主机的端口绑定，将通过该端口的数据发送到指定主机。

>远程端口转发和本地端口转发的区别：
>远程端口转发是让自己接管远程主机的数据，好比，小明给小芳打电话说，以后你上班做我的车，我送你去。
>本地端口转发是主动将自己的数据发送给中转主机，好比，小芳给小明打电话，以后我做你的车去上班。

命令的使用基本一致，只是参数不同，原来的`-L`换成了`-R`。
命令格式为
```
ssh -R 远程主机端口:目标主机:目标主机端口 远程主机
```
还是接着看上面那个例子，host1与host2之间无法连通，必须借助host3转发。但是，特殊情况出现了，host3是一台内网机器，它可以连接外网的host1，但是反过来就不行，外网的host1连不上内网的host3。这时，"本地端口转发"就不能用了，怎么办？

解决办法是，既然host3可以连host1，那么就从host3上建立与host1的SSH连接，然后在host1上使用这条连接就可以了。

我们在host3执行下面的命令：

```
# host3
ssh -R 2121:host2:21 host1
```
命令分为3部分
1. ssh:指令名称
2. -R 2121:host2:21: `-R`是命令参数，它接收3个值，分别是"远程主机端口:目标主机:目标主机端口"。这条命令的意思，就是让host1监听它自己的2121端口，然后将所有数据经由host3，转发到host2的21端口。由于对于host3来说，host1是远程主机，所以这种情况就被称为"远程端口绑定"。

>数据流向：host1:2121->host3->host2:21

在host1上执行命令
```
#host1
ftp localhost:2121
```
这样host1就可以链接host2了，因为host3将host1的数据转发给了host2.

## ssh参数介绍

常用命令
```
ssh -C -f -N -g -L listen_port:DST_Host:DST_port user@Tunnel_Host
ssh -C -f -N -g -R listen_port:DST_Host:DST_port user@Tunnel_Host
ssh -C -f -N -g -D listen_port user@Tunnel_Host
```
1. -f Fork into background after authentication.
后台认证用户/密码，通常和-N连用，不用登录到远程主机。

2. -L port:host:hostport
将本地机(客户机)的某个端口转发到远端指定机器的指定端口. 工作原理是这样的, 本地机器上分配了一个 socket 侦听 port 端口, 一旦这个端口上有了连接, 该连接就经过安全通道转发出去, 同时远程主机和 host 的 hostport 端口建立连接. 可以在配置文件中指定端口的转发. 只有 root 才能转发特权端口. IPv6 地址用另一种格式说明: port/host/hostport

3. -R port:host:hostport
将远程主机(服务器)的某个端口转发到本地端指定机器的指定端口. 工作原理是这样的, 远程主机上分配了一个 socket 侦听 port 端口, 一旦这个端口上有了连接, 该连接就经过安全通道转向出去, 同时本地主机和 host 的 hostport 端口建立连接. 可以在配置文件中指定端口的转发. 只有用 root 登录远程主机才能转发特权端口. IPv6 地址用另一种格式说明: port/host/hostport

4. -D port
指定一个本地机器 “动态的’’ 应用程序端口转发. 工作原理是这样的, 本地机器上分配了一个 socket 侦听 port 端口, 一旦这个端口上有了连接, 该连接就经过安全通道转发出去, 根据应用程序的协议可以判断出远程主机将和哪里连接. 目前支持 SOCKS4 协议, 将充当 SOCKS4 服务器. 只有 root 才能转发特权端口. 可以在配置文件中指定动态端口的转发.

5. -C Enable compression.
压缩数据传输。

6. -N Do not execute a shell or command.
不执行脚本或命令，通常与-f连用。

7. -g Allow remote hosts to connect to forwarded ports.
在-L/-R/-D参数中，允许远程主机连接到建立的转发的端口，如果不加这个参数，只允许本地主机建立连接。注：这个参数我在实践中似乎始终不起作用。

## 参考资料
http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html
http://www.ruanyifeng.com/blog/2011/12/ssh_port_forwarding.html
http://chenweiguang.blogspot.com/2009/03/ssh.html
https://blog.csdn.net/left_la/article/details/41519843