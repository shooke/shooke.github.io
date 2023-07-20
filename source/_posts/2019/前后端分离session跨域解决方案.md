---
title: 前后端分离session跨域解决方案
categories:
  - 笔记
tags:
  - axios
  - vue
  - php
  - session
date: 2019-02-01 15:06:27
---
## session
php的session比cookie安全，这是好多人知道的常识。session的数据是存放在服务端的，那么程序是如何取到对应的session呢？
那是因为每一个session都有一个身份证号，那就是session id。这个东西一般情况下，服务器会发送给客户端，客户端将它放在cookie里。
cookie是存在跨域问题的，什么叫跨域呢？a.domain.com下创建的cookie,在b.domain.com下是无法使用的，我们需要进行跨域设置。
## axios
用过vue开发前后端分离程序的人对axios相比都不陌生了，js前后端分离，如果前后端用两个域名，也存在跨域问题。
<!-- more -->
跨域是个老生常谈的问题了，特别是前后端分离以后。解决前后端分离其实没有想象中的那么难，主要是明白其中的道理。首先先了解介个基本知识。
## session
php的session比cookie安全，这是好多人知道的常识。session的数据是存放在服务端的，那么程序是如何取到对应的session呢？
那是因为每一个session都有一个身份证号，那就是session id。这个东西一般情况下，服务器会发送给客户端，客户端将它放在cookie里。
cookie是存在跨域问题的，什么叫跨域呢？a.domain.com下创建的cookie,在b.domain.com下是无法使用的，我们需要进行跨域设置。
## axios
用过vue开发前后端分离程序的人对axios相比都不陌生了，js前后端分离，如果前后端用两个域名，也存在跨域问题。
## 解决跨域
前端请求后端接口跨域很容易解决，服务端设置好返回头就可以了，如下：
```
if ($request_method = 'OPTIONS') {
                    add_header 'Access-Control-Allow-Origin' '$http_origin';
                    add_header 'Access-Control-Allow-Credentials' 'true';
                    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
                    add_header 'Access-Control-Allow-Headers' 'Origin, DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type, Accept, authKey, sessionId, business,shop';
                    #add_header 'Access-Control-Allow-Headers' '*';
                    add_header 'Access-Control-Max-Age' 1728000;
                    add_header 'Content-Type' 'text/plain charset=UTF-8';
                    add_header 'Content-Length' 0;

                    return 204;
                }
```
发个全一点的
```
location / {
                if ($request_method = 'OPTIONS') {
                    add_header 'Access-Control-Allow-Origin' '$http_origin';
                    add_header 'Access-Control-Allow-Credentials' 'true';
                    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
                    add_header 'Access-Control-Allow-Headers' 'Origin, DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type, Accept, authKey, sessionId, business,shop';
                    #add_header 'Access-Control-Allow-Headers' '*';
                    add_header 'Access-Control-Max-Age' 1728000;
                    add_header 'Content-Type' 'text/plain charset=UTF-8';
                    add_header 'Content-Length' 0;

                    return 204;
                }
                if (!-e $request_filename) {
                    rewrite  ^(.*)$  /index.php?s=/$1  last;
                    break;
                }

                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }

```
这样设置后，普通的ajax跨域请求基本就可以了，当然这里的location要根据你的实际情况，也有可能是`location ~ \.php$ `
如果这写头信息无法满足，你也可以使用php的header函数重新设置header头。
经过上面的配置普通的跨域请求就可以正常执行了。接下来说一下携带cookie的跨域解决。
## session跨域
上面说过session默认依赖cookie，所以我们创建session的时候要进行一下设置。
```
ini_set('session.cookie_domain', '.domain.com');
```
创建session之前一定要有上面的设置，这样cookie就可以在a.domain.com和b.domain.com都有效。
后端支持了，还有前端，ajax请求默认不携带cookie信息，如何让它带上呢。很简单，ajax对象有一个`withCredentials`属性，将它设置为true就可以了
```
var xhr = new XMLHttpRequest(); // IE8/9需用window.XDomainRequest兼容

// 前端设置是否带cookie
xhr.withCredentials = true;

xhr.open('post', 'http://a.domain.com:8080/login', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send('user=admin');

xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        alert(xhr.responseText);
    }
};
```
上面是普通ajax的实例，axios可以按下面的配置
```
axios.defaults.withCredentials = true
```

