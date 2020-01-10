---
title: nginx配置结构说明
categories:
  - 笔记
tags:
  - nginx
date: 2020-01-10 14:20:08
---
最近做项目发现服务器上nginx的配置很混乱，主要原因就是配置的人不太了解nginx的配置。从网上查了资料之后就复制了。

## 配置结构
nginx的配置其实很简单，总共也就分为4部分：main（全局设置）、server（主机设置）、upstream（负载均衡服务器设置）和 location（URL匹配特定位置的设置）
他们的关系是，server继承main，location继承server，upstream既不会继承其他设置也不会被继承。
所以配置的优先级就是 location > server > main

一级指的是nginx的入口配置文件`nginx.conf`,这个文件的存放位置根据安装环境有所差异。比如使用源码包安装nginx到`/usr/local`。nginx.conf就会在`/usr/local/nginx/conf/nginx.conf`。

nginx.conf中一般是这样
```
user nobody nobody;
worker_processes 2;
error_log logs/error.log notice;
pid logs/nginx.pid;
worker_rlimit_nofile 65535;
 
events{
use epoll;
worker_connections 65536;


http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    keepalive_timeout  65;

    #gzip  on;

    server {
            listen       80;
            server_name  localhost;

            #charset koi8-r;

            #access_log  logs/host.access.log  main;

            location / {
                root   html;
                index  index.html index.htm;
            }

            #error_page  404              /404.html;

            # redirect server error pages to the static page /50x.html
            #
            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   html;
            }

            # proxy the PHP scripts to Apache listening on 127.0.0.1:80
            #
            #location ~ \.php$ {
            #    proxy_pass   http://127.0.0.1;
            #}
    }

}
```

## http配置
http里面主要做一些server中会用到的通用配置，比如mime，日志格式log_format，负载均衡等。
http里面放多个server，一般为了方便管理，我们会把server放到一个叫vhost的文件夹内。然后用`include vhost/*.conf;`的方式加载进来。

## server配置
http中的配置项，server中也可以使用，如果某个站点需要个性化配置，可以自行配置。
相同的配置项，server中的配置优先级高于http。

## location配置
主要用于请求转发，或者针对某个路由进行特殊处理。经常用到的场景是为了节省域名，前端和后端都部署在一个域名下。接口用XXX.com/api去访问，这时候可以通过location做转发

## upstream配置
负载均衡可以放在http内部，也可以放在http的外层。这就方便了灵活配置。如果只有一个负载配置多server公用，可以在`nginx.conf`中配置，在各个server中使用。
如果每个server有自己的负载配置。就可以把配置放在自己的配置文件`vhost/server1.conf`中。

