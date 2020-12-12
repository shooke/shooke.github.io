---
title: ubuntu18.04编译安装php7.0
categories:
  - 笔记
tags:
  - php
date: 2020-12-12 23:10:30
---

## 起因
虽然7.0已经停止维护了，但有些老项目也只是过度，后期直接用新项目替换，没有必要在进行升级。所以服务器还是需要用到7.0的运行环境。
本来想用apt简单按一下，结果发现apt里面已经没有php7.0了。只能自己源码安装。

<!-- more -->

## 安装
在安装编译安装前，需要先准备一下编译需要的环境。
```
sudo apt update
sudo apt install gcc
sudo apt install make
sudo apt install openssl
sudo apt install curl
sudo apt install libbz2-dev
sudo apt install libxml2-dev
sudo apt install libjpeg-dev
sudo apt install libpng-dev
sudo apt install libfreetype6-dev
sudo apt install libzip-dev
apt-get install libxml2-dev
apt-get install libcurl4-openssl-dev
```
下载源码包,为了安全起见，当然要去官网下载`https://www.php.net/releases/`这里有历史版本。
找到7.0系列的版本用wget下载即可，或者去php的github clone一下项目也可以
```
$ cd /usr/local/src
$ wget https://www.php.net/distributions/php-7.0.32.tar.gz

$ cd php-7.0.32

$ ./configure --prefix=/usr/local/php7.0 --with-config-file-path=/usr/local/php7.0/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --with-mysqli --with-pdo-mysql --with-iconv-dir --with-freetype-dir --with-jpeg-dir --with-png-dir --with-zlib  --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl --enable-mbregex --enable-mbstring --enable-ftp --with-gd --with-openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-soap  --with-gettext --disable-fileinfo --enable-maintainer-zts

$ make

$ make install

```
可以根据自己的需求进行`./configure`，上面的配置是比较全面的，几乎所有用到的扩展都安装了。如果有些扩展不需要可以使用without或disable排除，比如`--without-pear`

安装完成，需要做一下配置，进入php7.0的安装目录`/usr/local/php7.0`。复制一下php配置文件.
```
cd /usr/local/php7.0
cd  etc
cp php-fpm.conf.default php-fpm.conf
cp php-fpm.d/www.conf.default php-fpm.d/www.conf
```
看一下`php-fpm.d/www.conf` 里面找到
```
user = www
group = www

```
给user和group配置成现有的用户、用户组。或者根据配置创建`www`账号和用户组也可以
查找 `listen`如果没有`listen`配置，自己添加
```
listen = 127.0.0.1:9000

```
然后讲php-fpm运行起来。
```
/usr/local/php7.0/sbin/php-fpm
```

## 配置nginx
因为php listen配置的是监听9000端口，所有nginx配置要是
```
location ~ \.php {
                if ($request_method = 'OPTIONS') {
                    add_header 'Access-Control-Allow-Origin' '*' always;
                    add_header 'Access-Control-Allow-Credentials' 'true' always;
                    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
                    add_header 'Access-Control-Allow-Headers' 'Origin, DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type, Accept, authKey, sessionId, business,shop';
                    #add_header 'Access-Control-Allow-Headers' '*';
                    add_header 'Access-Control-Max-Age' 1728000;
                    add_header 'Content-Type' 'text/plain charset=UTF-8';
                    add_header 'Content-Length' 0;

                    return 204;
                }
                include snippets/fastcgi-php.conf;

                # With php7.0-cgi alone:
                fastcgi_pass 127.0.0.1:9000;
        #       # With php7.0-fpm:
        #       fastcgi_pass unix:/run/php/php7.2-fpm.sock;
        }

```

## 安装其他插件
### redis
redis是常用软件，redis官方为php提供了插件。可以使用pecl安装，也可以自己编译。
```
/usr/local/php7.0/bin/pecl install redis
```
安装完成后会有提示
```
Build process completed successfully
Installing '/usr/local/php7.0/lib/php/extensions/no-debug-zts-20151012/redis.so'
install ok: channel://pecl.php.net/redis-5.3.2
configuration option "php_ini" is not set to php.ini location
You should add "extension=redis.so" to php.ini

```
这是后需要在php.ini里添加`extension=redis.so`如果没哟php.ini文件，就在php配置目录创建一个。

添加配置后需要重启php-fpm，然后`nginx -s reload`，redis就生效了。

### mcrypt
这次用编译方式，首先下载源码包
```
wget https://pecl.php.net/get/mcrypt-1.0.1.tgz
```
使用phpize处理一下
```
tar zxvf mcrypt-1.0.1.tgz
cd mcrypt-1.0.1
/usr/local/php7.0/bin/phpize

```
接下来开始编译，编译需要制定php-config的路径
```
./configure --with-php-config=/usr/local/php7.0/bin/php-config
make
make install
```
安装完成，出现如下信息
```
Installing shared extensions:     /usr/local/php7.0/lib/php/extensions/no-debug-zts-20151012/
```
在php.ini中加入编译的插件
```
extension=mcrypt.so

```

安装完插件，重启php-fpm和nginx就可以了
