---
title: logstash+doris收集springboot日志
date: 2025-01-23 18:16:04
tags: 
  - logstash
  - doris
  - springboot
---

之前做过elk收集springboot日志，但是elk太重了，现在换成轻量级的logstash+doris。

<!-- more -->

## 1. doris创建表
```
CREATE TABLE `run_log` (
  `create_time` datetime NULL COMMENT '创建时间',
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `appname` VARCHAR NULL COMMENT 'hostname or ip',
  `host` VARCHAR NULL COMMENT 'log file path',
  `level` VARCHAR NULL COMMENT 'log type',
  `logger_name` VARCHAR NULL COMMENT 'log name',
  `message` text NULL COMMENT 'log message',
  `stack_trace` text NULL COMMENT 'log stack_trace',
  `port` INT NULL COMMENT 'log code position',
  `thread_name` STRING NULL COMMENT 'log message',
  INDEX idx_create_time (`create_time`) USING INVERTED COMMENT '',
  INDEX idx_appname (`appname`) USING INVERTED COMMENT '',
  INDEX idx_host (`host`) USING INVERTED COMMENT '',  
  INDEX idx_level (`level`) USING INVERTED COMMENT '',
  INDEX idx_logger_name (`logger_name`) USING INVERTED COMMENT '',
  INDEX idx_port (`port`) USING INVERTED COMMENT '',
  INDEX idx_thread_name (`thread_name`) USING INVERTED COMMENT '',
  INDEX idx_message (`message`) USING INVERTED PROPERTIES("parser" = "unicode", "support_phrase" = "true") COMMENT '',
  INDEX idx_stack_trace (`stack_trace`) USING INVERTED PROPERTIES("parser" = "unicode", "support_phrase" = "true") COMMENT ''

) ENGINE=OLAP
DUPLICATE KEY(`create_time`)
COMMENT '日志记录'
PARTITION BY RANGE(`create_time`) ()
DISTRIBUTED BY RANDOM BUCKETS 10
PROPERTIES (
"replication_num" = "1",
"dynamic_partition.enable" = "true",
"dynamic_partition.time_unit" = "DAY",
"dynamic_partition.start" = "-15",
"dynamic_partition.end" = "1",
"dynamic_partition.prefix" = "p",
"dynamic_partition.buckets" = "10",
"dynamic_partition.create_history_partition" = "true",
"compaction_policy" = "time_series"
);
```

## 2. logstash安装配置
### 安装logstash
```
# 下载安装logstash
cd /opt
wget https://artifacts.elastic.co/downloads/logstash/logstash-8.4.3-linux-x86_64.tar.gz
tar -zxvf logstash-8.4.3-linux-x86_64.tar.gz
cd logstash-8.4.3
```

### 安装插件
不包含依赖的安装包 https://apache-doris-releases.oss-accelerate.aliyuncs.com/logstash-output-doris-1.0.0.gem
包含依赖的安装包 https://apache-doris-releases.oss-accelerate.aliyuncs.com/logstash-output-doris-1.0.0.zip

进入 Logstash 的安装目录，运行它下面的 bin/logstash-plugin 命令安装插件
安装成功会提示

```
wget https://apache-doris-releases.oss-accelerate.aliyuncs.com/logstash-output-doris-1.0.0.gem
./bin/logstash-plugin install logstash-output-doris-1.0.0.gem
#如果出现下面的提示说明成功了
Installing file: logstash-output-doris-1.0.0.zip
Resolving dependencies.........................
Install successful
```

普通安装模式会自动安装插件依赖的 ruby 模块，对于网络不通的情况会卡住无法完成，这种情况下可以下载包含依赖的zip安装包进行完全离线安装，注意需要用 file:// 指定本地文件系统。

```
wget https://apache-doris-releases.oss-accelerate.aliyuncs.com/logstash-output-doris-1.0.0.zip
./bin/logstash-plugin install file:///tmp/logstash-output-doris-1.0.0.zip
#如果出现下面的提示说明成功了
Installing file: logstash-output-doris-1.0.0.zip
Resolving dependencies.........................
Install successful
```

### 配置logstash
到logstash的config目录下创建一个logstash-doris.conf文件,配置如下.
注意插件走的是http协议，因此需要配置FE的http端口，千万不要用mysql协议端口

```
input {
tcp {
    port => 9601
    codec => json_lines
  }
}

output {
  doris {
      http_hosts => ["http://FE-host:8080"]
      user => "user"
      password => "password"
      db => "run_log"
      table => "system_log"
      headers => {
          "format" => "json"
          "read_json_by_line" => "true"
          "load_to_single_tablet" => "true"
      }
      # field mapping: doris fileld name => logstash field name
      # %{} to get a logstash field, [] for nested field such as [host][name] for host.name
      mapping => {
          "create_time" => "%{@timestamp}"
          "appname"=> "%{appname}"
          "host" => "%{host}"
          "level" => "%{level}"
          "logger_name" => "%{logger_name}"
          "message" => "%{message}"
          "stack_trace" => "%{stack_trace}"
          "port" => "%{port}"
          "thread_name" => "%{thread_name}"
      }
      log_request => true
      log_speed_interval => 10
  }
}
```

### 启动logstash

```
./bin/logstash -f config/logstash-doris.conf
```

## 3. springboot配置
在pom里引入依赖
```
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>4.11</version>
</dependency>
```
在启动类的resources目录下创建logback-spring.xml，配置如下
如果只有一个配置文件可以不要springProfile这一层，直接写root
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration>
<configuration>
    <!--引用springboot默认配置-->
    <include resource="org/springframework/boot/logging/logback/base.xml"/>

    <appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <!--指定logstash ip：监听端口-->
        <destination>logstash服务器id:input tcp配置的端口</destination>
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LogstashEncoder">
            <customFields>{"appname":"模块或系统名称"}</customFields>
        </encoder>
    </appender>



    <springProfile name="配置文件，多个可以用逗号隔开，如果没有多配置">
        <!-- 打印 日志级别 -->
        <root level="info">
            <!--使用上述订阅logstash数据tcp传输 -->
            <appender-ref ref="LOGSTASH" />
            <!--使用springboot默认配置 调试窗口输出-->
            <appender-ref ref="CONSOLE" />
        </root>
    </springProfile>
</configuration>

```
启动springboot项目，日志就会自动写入到doris中了。




