---
title: jar包运行参数配置
categories:
  - 笔记
tags:
  - java
date: 2023-09-18 20:06:28
---
三种jar包启动时传参的方式

1. jvm传值 -Dkey_name=value
这种方式已 `-D`开头，放在jar包之前
```
java  -Ddatabasename=test  -jar  test.jar
```

2. 给main函数传值 key_name=value
```
java  -jar  test.jar databasename=test
```
治理要求参数放在jar包之后，main方法中可以接收参数
```
public static void main(String[] args) throws IOException {
           for(String arg : args){
               log.info("参数：" + arg);
           }
    }
```

3. 覆盖yaml或properties 文件参数 --key_name=value
```
java -jar tes.jar --logName=log.txt
```
这里要求参数放在jar包之后用`--`开头,程序中可以使用`@Value`注解获取参数值
```
@Value("${logName}")
private String logName; //输出：log.txt
```