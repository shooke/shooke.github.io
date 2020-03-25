---
title: 让nginx支持flv文件播放
categories:
  - 笔记
tags:
  - nginx
  - flv
date: 2020-03-25 10:51:34
---

## 起因
最近做小程序直播，为了简单测试需要用到`live-player`播放一个flv文件。服务器上用的nginx。把flv文件放到目录下访问，居然无法播放。查看了一下配置才发现，nginx不支持flv，需要响应的插件。

## 初次安装
如果是编译安装的非常简单，只需要在`configure`时添加`--with-http_flv_module`就可以了。
```
$ ./configure  --with-http_flv_module 
$ make && make install
```
专业就安装完成了。

## 对已安装的nginx，添加模块
如果已经安装过nginx，比如使用apt或yum安装过了。该怎么办呢？

### 1. 首先去nginx官网下载一个相同版本的nginx源码包

```
$ nginx -v
nginx version: nginx/1.10.3

```
注意是小写的`v`查看nginx版本，然后去官网下载`http://nginx.org/en/download.html`
```
wget http://nginx.org/download/nginx-1.10.3.tar.gz
```
解压源码包,进入目录
```
tar zxvf nginx-1.10.3.tar.gz
cd nginx-1.10.3
```

### 2. 用与当前nginx编译参数的基础上进行编译

```
$ nginx -V
nginx version: nginx/1.13.12
built with OpenSSL 1.1.0h  27 Mar 2018
TLS SNI support enabled
configure arguments: --with-cc-opt='-g -O2 -fdebug-prefix-map=/build/nginx-THAKdv/nginx-1.13.12=. -fstack-protector-strong -Wformat -Werror=format-security -fPIC -Wdate-time -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-z,relro -Wl,-z,now -fPIC' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-debug --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_geoip_module=dynamic --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module=dynamic --with-http_sub_module --with-http_xslt_module=dynamic --with-stream=dynamic --with-stream_ssl_module --with-stream_ssl_preread_module --with-mail=dynamic --with-mail_ssl_module --add-dynamic-module=/build/nginx-THAKdv/nginx-1.13.12/debian/modules/http-auth-pam --add-dynamic-module=/build/nginx-THAKdv/nginx-1.13.12/debian/modules/http-dav-ext --add-dynamic-module=/build/nginx-THAKdv/nginx-1.13.12/debian/modules/http-echo --add-dynamic-module=/build/nginx-THAKdv/nginx-1.13.12/debian/modules/http-upstream-fair --add-dynamic-module=/build/nginx-THAKdv/nginx-1.13.12/debian/modules/http-subs-filter
```
注意是大写的`V`，`configure arguments:`后面就是当前nginx的编译参数，接下来在此基础上添加`--with-http_flv_module`参数进行编译
```
$ ./configure --with-cc-opt='-g -O2 -fdebug-prefix-map=/build/nginx-THAKdv/nginx-1.13.12=. -fstack-protector-strong -Wformat -Werror=format-security -fPIC -Wdate-time -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-z,relro -Wl,-z,now -fPIC' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-debug --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_geoip_module=dynamic --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module=dynamic --with-http_sub_module --with-http_xslt_module=dynamic --with-stream=dynamic --with-stream_ssl_module --with-stream_ssl_preread_module --with-mail=dynamic --with-mail_ssl_module --add-dynamic-module=/build/nginx-THAKdv/nginx-1.13.12/debian/modules/http-auth-pam --add-dynamic-module=/build/nginx-THAKdv/nginx-1.13.12/debian/modules/http-dav-ext --add-dynamic-module=/build/nginx-THAKdv/nginx-1.13.12/debian/modules/http-echo --add-dynamic-module=/build/nginx-THAKdv/nginx-1.13.12/debian/modules/http-upstream-fair --add-dynamic-module=/build/nginx-THAKdv/nginx-1.13.12/debian/modules/http-subs-filter --with-http_flv_module
```
最后加入了`--with-http_flv_module`参数，编译过程中可能会报错，大都是依赖错误，比如缺少gd库，如果是ubuntu，安装时库的命名一般是lib开头。比如GD库，用`apt install libgd-dev`。具体问题具体分析。

config处理完成执行`make`进行编译，注意一定不要执行`make install`，会覆盖原有程序的。
```
$ make
```
等待编译完成，进行最后一步也是最重要的工作。将编译好的nginx复制到当前nginx所在目录下，进行替换。

### 3. 替换编译文件
替换nginx 可执行文件前，我们做一下备份。
重新编译后的nginx 可执行文件在 objs 目录下，我们只需要将 nginx 文件替换即可。
如果通过apt命令安装的nginx，那么nginx文件在`/usr/sbin/nginx`。如果是通过手动编译，可以查看`--prefix`参数指定的目录，在里面找到`sbin`目录，里面就是我们要替换的nginx。
这里以apt安装为例。
停止nginx服务
```
$ sudo systemctl stop nginx.service
```
备份老nginx，复制新编译的nginx进行替换
```
$ sudo cp /usr/sbin/nginx /usr/sbin/nginx.bak
$ cp ./objs/nginx /usr/sbin/
```
重启nginx服务
```
$ sudo systemctl start nginx.service
```
大工告成。

## 配置虚拟主机
nginx安装完了，接下来配置虚拟主机支持flv就可以了，很简单。在需要配置的虚拟主机`server`里添加一下flv配置就可以了

```
server {  
  ...
   location ~ \.flv$ {
	  flv;
   }
  ...
} 

```