---
title: springboot 配置
categories:
  - springboot
tags:
  - spring boot
  - spring boot 配置
date: 2020-06-12 13:16:57
---
## application.properties配置中文乱码问题
删除现有的文件，设置idea。setting->editor->file encodings 将`Global Encoding` `Project Encoding` `Default encoding for properties files`都设置成`utf-8`.并且勾选`Transparent native-to-ascii conversion`

## 多配置时`spring.profiles.active=dev`不生效
如果只有`application.properties`和`application-dev.properties`这两个文件，是不行的，需要在增加一个文件比如`application-prod.properties`。
只有配置文件多余2个才会生效

## 配置使用
application-dev.properties内容如下
```
com.dudu.name="张三"
com.dudu.want="跑步"
com.dudu.sex="男"
```
### 直接使用配置
在需要用到的地方使用,在属性上使用`@Value`注解就可以
```
@Value("${com.dudu.name}")
private String name;
```
### 使用bean对象方式
config/ConfigBean.java 代码如下，值得注意的是`@Configuration`注解非常重要，如果没有这个注解是不生效的。
其实还有`@EnableConfigurationProperties`注解方式，但使用起来不如`@configuration`方便。
```
package com.springboot.config.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


/**
 * @author shooke
 */
@Configuration
@ConfigurationProperties(prefix="com.dudu")
public class ConfigBean {
    private String name;
    private String sex;
    private String want;

    public String getWant() { return want;}

    public void setWant(String want) { this.want = want;}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }
}
```
在需要用到配置的地方，直接初始化一个ConfigBean的对象就可以了
```
@Autowired
ConfigBean conf;

@RequestMapping("/dev")
public String dev(){
    return conf.getName();
}
```

## 使用自定义properties
有时候配置项太多了，咱们就拆分成不同的文件。拆分的文件使用需要用到`@PropertySource`注解，指定一下配置文件路径
```
/**
 * @author shooke
 */
@Configuration
@ConfigurationProperties(prefix = "com.md")
@PropertySource("classpath:test.properties")
public class ConfigTestBean {
    private String name;
    private String want;
    // 省略getter和setter

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getWant() {
        return want;
    }

    public void setWant(String want) {
        this.want = want;
    }
}

```

## 代码

## 参考资料
http://tengj.top/2017/02/28/springboot2/