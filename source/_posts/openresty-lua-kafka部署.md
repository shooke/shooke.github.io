---
title: openresty+lua+kafka部署
categories:
  - 笔记
tags:
  - openresty
  - lua
  - kafka
date: 2020-02-26 17:59:07
---
## 背景
1. 使用kafka作为消息队列，将信息收集起来
2. 已有程序无需修改，改起来成本太高了
满足这两个条件，首先想到的就是用nginx把数据转发出去，这样程序不用改动，只改变运维环境就可以了。

<!-- more -->

## 安装openresty
openresty源码安装的过程中，与服务器上的包依赖有冲突。所以改用apt方式安装。很简单。
```
# 安装导入 GPG 公钥时所需的几个依赖包（整个安装过程完成后可以随时删除它们）：
sudo apt-get -y install --no-install-recommends wget gnupg ca-certificates

# 导入我们的 GPG 密钥：
wget -O - https://openresty.org/package/pubkey.gpg | sudo apt-key add -

# 安装 add-apt-repository 命令
# （之后你可以删除这个包以及对应的关联包）
sudo apt-get -y install --no-install-recommends software-properties-common

# 添加我们官方 official APT 仓库：
sudo add-apt-repository -y "deb http://openresty.org/package/ubuntu $(lsb_release -sc) main"

# 更新 APT 索引：
sudo apt-get update

# 安装openresty
sudo apt-get -y install openresty
```

## 安装kafka

1. 下载kafka
进入Apache官网http://kafka.apache.org/downloads.html

找到`Binary downloads`，选择版本进行下载。

也可以复制下载链接，然后用`wget`下载
```
 wget http://apache.01link.hk/kafka/2.0.0/kafka_2.11-2.0.0.tgz
```

2. 解压程序包
压缩包下载后先移动到`/opt`目录，这是我的习惯，自己安装的放到`/opt`目录下建一个软件目录，比如`/opt/kafka`,这样方便管理
```
mv kafka_2.11-2.0.0.tgz /opt
cd /opt
tar -xzf kafka_2.11-2.0.0.tgz
```
这样kafka就安装完了，安装目录就是`/opt/kafka_2.11-2.0.0`

3.配置hosts文件
将本机的局域网ip和127.0.0.1都配置上,否则会造成kafka无法启动。kafka启动过程中会根据当前主机名进行解析，如果不设置会报错
```
# shooke-pc是我的主机名，ip和主机名根据具体情况配置
192.168.99.36 shooke-pc
127.0.0.1 shooke-pc

```

3. 启动kafka服务

启动zookeeper
```
/opt/kafka_2.11-2.0.0/bin/zookeeper-server-start.sh  /opt/kafka_2.11-2.0.0/config/zookeeper.properties 
```
kafka依赖zookeeper的，如果有自己的zookeeper服务，可以不启动这个。

启动kafka
```
/opt/kafka_2.11-2.0.0/bin/kafka-server-start.sh  /opt/kafka_2.11-2.0.0/config/server.properties 
```
这样kafka服务就启动了。

> 如果希望后台运行可以加`-daemon`参数，或用`nohup`去实现效果

## 安装lua-resty-kafka
`lua-resty-kafka`是`openresty`和`kafka`的桥梁。安装了这个插件就可以让`openresty`吧数据转发到`kafka`了。
```
# 下载插件
wget https://github.com/doujiang24/lua-resty-kafka/archive/master.zip
# 解压
unzip master.zip
# 老规矩自己装的软件放到/opt目录
mv lua-resty-kafka-master /opt/lua-resty-kafka
```

## 让openresty和kafka建立联系

1.配置kafka

修改`/opt/kafka_2.11-2.0.0/config/server.properties`，找到`listeners`，根据具体情况修改
```
# 这个ip地址是kafka在内网的地址，记住这个ip，下面nginx配置中也会用到，一定要对应
listeners=PLAINTEXT://192.168.99.36:9092

```

2.配置nginx

接下来配置openresty的nginx，让nginx和kafka联系起来
修改`/etc/openresty/nginx.conf` 在http节点内添加如下内容
```
http {
    # 配置个负载均衡方便测试
    upstream apps {
        keepalive 80;
        server 127.0.0.1:8078;
    }

    # `lua-resty-kafka`路径
    lua_package_path "/opt/lua-resty-kafka/lib/?.lua;/opt/lua-resty-http/lib/?.lua;";
  
    server {
        listen       8077;
        server_name  localhost;

        location / {

            proxy_next_upstream http_502 http_504 http_404 error invalid_header;
            # 负载均衡
            proxy_pass http://apps;
            proxy_http_version 1.1;
            proxy_redirect off;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            #proxy_set_header Connection "";
            proxy_set_header X-real-ip $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # 编写lua脚本
            log_by_lua '
                local cjson = require "cjson"
                local producer = require "resty.kafka.producer"
                local broker_list = {
                  { host = "192.168.99.36", port = 9092 }
                }
                local topic = "logs"
                local log_json = {}
                log_json["uri"]=ngx.var.uri
                log_json["args"]=ngx.var.args
                log_json["host"]=ngx.var.host
                log_json["cookie"]=ngx.var.http_cookie
                log_json["method"]=ngx.var.request_method
                log_json["request_body"]=ngx.var.request_body
                log_json["remote_addr"] = ngx.var.remote_addr
                log_json["remote_user"] = ngx.var.remote_user
                log_json["time_local"] = ngx.var.time_local
                log_json["status"] = ngx.var.status
                log_json["body_bytes_sent"] = ngx.var.body_bytes_sent
                log_json["http_referer"] = ngx.var.http_referer
                log_json["http_user_agent"] = ngx.var.http_user_agent
                log_json["http_x_forwarded_for"] = ngx.var.http_x_forwarded_for
                log_json["upstream_response_time"] = ngx.var.upstream_response_time
                log_json["http_current_user"] = ngx.var.upstream_http_x_current_user
                log_json["request_time"] = ngx.var.request_time
                local postargs = ngx.req.get_body_data()
		            log_json["post_data"] = postargs
                log_json["res_body"] = ngx.var
                local message = cjson.encode(log_json);
                local bp = producer:new(broker_list, { producer_type = "async" })
                local ok, err = bp:send(topic, nil, message)
                if not ok then
                    ngx.log(ngx.ERR, "kafka send err:", err)
                    return
                end
            ';
        }


    }

    server {
        listen    8078;

        location / {
          content_by_lua 'ngx.say("hello world")';
        }
    }

}

```
设置完成后执行`systemctl restart openresty`重启服务就好了。访问8077端口请求会转发到kafka。
让nginx配置生效也可以执行`/usr/local/openresty/nginx/sbin/nginx -s reload`

## 注意事项
1.`/etc/hosts`文件要配置上ip和主机名，否则kafka会无法启动报错找不到
2.kafka `server.properties`中`listeners`的ip要跟nginx配置的`broker_list`中`host`一致，否则会报错

## 参考资料
https://www.cnblogs.com/expiator/p/9990171.html
https://blog.csdn.net/qq_29497387/article/details/101290378
https://blog.csdn.net/u011239989/article/details/52239785
https://blog.csdn.net/qq_29497387/article/details/99745903
