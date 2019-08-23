---
title: '使用阿里云ecs主机打造shadowsocks服务器,实现科学上网'
categories:
  - 笔记
tags:
  - 科学上网
  - shadowsocks
  - shadowsocksR
date: 2019-04-11 15:10:46
---

要想打造一台自己的ss(shadowsocks)或ssr（shadowsocksR）服务器。要具备一下条件：
1. 要有一台自己的服务器vps或ecs云主机都可以，虚拟主机是不行滴
2. 服务器一定要在海外或中国香港。推荐日、韩、香港、新加坡服务器
下面已阿里ecs为实例说明，主要是ecs降价了`366/年`的价格速度很快。比网上说的搬瓦工、Vultr强多了。

<!-- more -->

## 一 购买云主机
进入 https://promotion.aliyun.com/ntms/act/qwbk.html?userCode=627kscqf 
选择第一项入门级配置的第一个就可以`1核1G 40G系统盘`，推荐选项
```
区域：新加坡
操作系统：centos 7
带宽：1M
```
区域选新加坡或香港都可以，不建议选欧美的，延时会比新加坡或香港高一丢丢。
带宽选择`1M`基本够用了，价格只有`￥366/年`,和买个爱奇艺会员差不多，2年也才`￥586`，非常便宜。
默认选择的是`2M` `￥504/年`的价格对我来说有点贵，如果你看电影多，可以选这个。
操作系统选centos7，是因为下面的操作命令是基于centos写的，如果你有一定linux基础，其实选择什么都可以。
选好了付款就可以了，支付宝付款很方便，还可以分期。

## 二 打造shadowsocks服务环境
买好了服务器，可以使用终端工具登录服务器。Xshell、Putty、SecureCRT都可以。
我平时使用的是deepin，所以使用自带的深度终端进行链接。给深度打个小广告，这是最好用的linux操作系统。

> 注意，我买的是新加坡的服务器，执行ssh命令登录时有点慢，需要等待20秒左右才会出现密码输入。但是ping的时候很快，登录后使用时也很快，只是ssh验证慢。不知道什么原因。

网上关于shadowsocks的安装教程有很多，但好多都比较麻烦，好在有人将安装过程做了打包。感谢一下作者。
开始正式安装，我们用最简单的方式，执行一下命令
```
yum -y install wget
wget -N --no-check-certificate https://raw.githubusercontent.com/CecilWu/SSR-Chinese/master/ssr.sh && chmod +x ssr.sh
```
耐心等待就可以了，下载完成后，我们执行`ls`会发现，在当前目录出现了一个`ssr.sh`文件。这个就是管理脚本，我们运行它
1. 运行管理脚本
```
./ssr.sh
```
脚本运行起来了，内容如下
```
ShadowsocksR 一键管理脚本 [v2.0.38]
  ---- Toyo | doub.io/ss-jc42 ----

  1. 安装 ShadowsocksR
  2. 更新 ShadowsocksR
  3. 卸载 ShadowsocksR
  4. 安装 libsodium(chacha20)
————————————
  5. 查看 账号信息
  6. 显示 连接信息
  7. 设置 用户配置
  8. 手动 修改配置
  9. 切换 端口模式
————————————
 10. 启动 ShadowsocksR
 11. 停止 ShadowsocksR
 12. 重启 ShadowsocksR
 13. 查看 ShadowsocksR 日志
————————————
 14. 其他功能
 15. 升级脚本
 
 当前状态: 已安装 并 已启动
 当前模式: 单端口

请输入数字 [1-15]：
```
输入`1`开始安装。
2. 设置端口
安装完毕后会要求你自定义端口，默认是2333，我们可以自己设置一个
3. 设置密码
端口设置完成会提示你输入密码，输入一个密码回车即可。
4. 选择加密方式
这里有很多加密方式，选择一种即可，一般选10：aes-256-cfb或rc4-md5
5. 协议兼容原版
输入`y`回车
6. 混淆插件
选择一种混淆插件，默认是`5`，选择`1`也可以
7. 连接数和限速设置
个人用可以不设置，直接回车
8. 安装部署
完成上面的操作，程序会开始下载需要的包，下载完成后会提示是否部署
```
Is this ok [y/n]
```
出现这个提示输入`y`就可以了，等它自己安装完成。
安装完成后会显示先前的配置。
```
===================================================

 ShadowsocksR账号 配置信息：

 I  P	    : 47.123.123.123
 端口	    : 2333
 密码	    : 123456
 加密	    : rc4-md5
 协议	    : auth_sha1_v4_compatible
 混淆	    : plain
 设备数限制 : 0(无限)
 单线程限速 : 0 KB/S
 端口总限速 : 0 KB/S
 SS    链接 : ss://sdfsdfsdfsdfsdfaadsffasd 
 SS  二维码 : http://doub.pw/qr/qr.php?text=ss://asdfsdfsadfsdfsdf
 SSR   链接 : ssr://dsfsdfsdfsdf 
 SSR 二维码 : http://doub.pw/qr/qr.php?text=ssr://sdfsdfsdfsd
 
  提示: 
 在浏览器中，打开二维码链接，就可以看到二维码图片。
 协议和混淆后面的[ _compatible ]，指的是 兼容原版协议/混淆。

===================================================

```
看到这个提示说明安装成功了。后期如果需要重新配置或查看配置，可以执行`ssr.sh`。还会弹出操作菜单。

## 设置阿里云主机端口
这一步很重要，阿里云入方向默认只开了22和3389端口。我们需要将Shadowsocks需要的端口打开，上面我们配置的是2333。具体方法如下
进入控制台-》商品与服务-》云服务器ecs， 然后在左侧菜单中找到`安全组`。右侧找到服务器，点击`配置规则`。
在配置页面选择`入方向`。点击右上角的`添加安全规则`。进行配置
```
规则方向：入方向
授权策略：允许
协议类型：自定义TCP
端口范围：2000/3000
优先级:1
授权类型：IPv4地址段访问
授权对象：0.0.0.0/0
```
这样你的电脑无论在哪里都可以链接到服务器了

## 安装客户端
Shadowsocks客户端有很多百度一下就可以了。安装后根据服务器的设置，配置一下客户端的参数就可以了。
我用的是deepin，使用的`Shadowsocks for Deepin`很好用，下载地址 https://github.com/lolimay/shadowsocks-deepin/blob/master/docs/README_CN.md

## 参考资料
https://www.5xiaobo.com/?id=693





