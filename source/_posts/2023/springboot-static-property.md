---
title: SpringBoot注入静态属性或静态对象
categories:
  - 笔记
tags:
  - java
  - spring
date: 2023-11-13 21:16:25
---
springboot中注入对象很方便，但是如果类是个工具类，里面的静态方法，只能使用静态属性。这时候就要想办法让静态属性可以被注入。

重点有两点 
1. 让spring接管类，可以使用@Component、@Service等注解
2. 使用setter或@PostConstruct，将属性注入

<!-- more -->

setter实例
```
@Component
public class GeoUtils {
    public static String redisKey;
    public static RedisTemplate redisTemplate;


    @Value("${redisKey}")
    public  void setRedisKey( String redisKey) {
        GeoUtils.redisKey = redisKey;
    }

    @Autowired
    public void setRedisTemplate(RedisTemplate redisTemplate){
        GeoUtils.redisTemplate = redisTemplate;
    }
}

```
PostConstruct方式实例
```
@Component
public class GeoUtils {

    public static RedisTemplate redisTemplateObj;

    public static String redisKey;

    /**
     * 这里的属性名称不能变要和定义的bean名字一样，如果修改了redisTemplate会报错
     */
    @Autowired
    private RedisTemplate redisTemplate;
    @Value("${zd.agreement.recharge.url}")
    private String rediskeyValue;


    @PostConstruct
    public void init(){
        GeoUtils.redisTemplateObj = this.redisTemplate;
        GeoUtils.redisKey = this.rediskeyValue;
    }
}
```


