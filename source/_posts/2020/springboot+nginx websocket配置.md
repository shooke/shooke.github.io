---
layout: springboot+nginx
title: springboot+nginx websocket配置
date: 2020-05-09 14:03:26
tags:
  - springboot
  - nginx
  - websocket
  
---

websocket用于聊天类场景再好不过了。平时链接websocket需要指定ip和端口，但如果需要用nginx做转发，将请求发送到websocket服务，这时候就需要升级协议了。
```
location /member-api/websocket {
                proxy_pass http://localhost:7005;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "Upgrade";
        }

```
就是这么简单，指定
```
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "Upgrade";
```
让协议升级就可以了