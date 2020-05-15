---
title: nginx配置中root alias的区别
categories:
  - 笔记
tags:
  - nginx
  - root
  - alias
date: 2020-05-15 11:03:07
---

## alias用法

- alias只能用在location块中
- 可以配置文件
- 可以配置目录

代理特定文件
```
location = /market-api/bm/44O1jrDWhJ.txt {
                alias /var/www/wechat/44O1jrDWhJ.txt;
        }
```

<!-- more -->

代理目录，建议最后面的`/`保留
```
location = /market-api/bm/ {
                alias /var/www/wechat/;
        }
```

## root用法

- 可以在http、server、location、if块中
- 只可配置目录
- 配置目录最后带`/`会抛弃localtion配置中的目录，不带`/`则会拼接


```
location = /market-api/bm {
                root /var/www/wechat/;
        }
```
带`/`时访问`/market-api/bm/a.txt`实际请求文件是`/var/www/wechat/a.txt`

```
location = /market-api/bm {
                root /var/www/wechat;
        }
```
不加`/`时访问`/market-api/bm/a.txt`实际请求文件是`/var/www/wechat/market-api/bm/a.txt`


## 参考资料
https://www.jianshu.com/p/57db2c5d0cb9
https://segmentfault.com/a/1190000017304865