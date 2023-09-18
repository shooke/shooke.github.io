---
title: springboot整合jasypt加密数据库配置
categories:
  - 笔记
tags:
  - java
  - jasypt
date: 2023-09-18 21:06:28
---
项目中会遇到数据库名称和密码需要加密防止泄露的需求，因此引入了jasypt。下面的例子是将jasypt的加密密钥写在了配置文件中，为了安全，实际引用时，需要将配置放到服务器的启动命令中，避免在代码中暴露密钥

1.引入maven依赖jasypt-spring-boot-starter
```
<dependency>
	<groupId>com.github.ulisesbocchio</groupId>
    <artifactId>jasypt-spring-boot-starter</artifactId>
    <version>3.0.4</version>
</dependency>
```
2.启动类添加注解@EnableEncryptableProperties
```
import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
@EnableEncryptableProperties
public class AdminMain {

    public static void main(String[] args) {
        SpringApplication.run(AdminMain.class, args);
    }
}
```

<!-- more -->

3. jasypt配置 这个配置，实际使用时要放在服务器的启动命令中，不要放在配置文件里

这里只是实例因此可以加载配置文件中
```
jasypt.encryptor.password=encryp_key
jasypt.encryptor.algorithm=PBEWithMD5AndDES
jasypt.encryptor.iv-generator-classname=org.jasypt.iv.NoIvGenerator
```

4. 生成加密后的参数

写一个test将账户和密码加密，然后将加密后的值配置到项目中
```
BasicTextEncryptor encryptor = new BasicTextEncryptor();
encryptor.setPassword("encryp_key"); //这里的encryp_key要和配置文件中jasypt.encryptor.password的值一致
String dbuser = encryptor.encrypt("dbuser"); // 数据库用户加密
System.out.println(dbuser);
String pwd = encryptor.encrypt("dbpassword"); // 数据库密码加密
System.out.println(pwd);
```

5. 使用第4步中生成的值配置数据库用户和密码
注意要用ENC将加密后的值括起来，这样才会解析
```
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/test?serverTimezone=GMT%2B8&useSSL=true&useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true
spring.datasource.username=ENC(UomDotatOpdIIRot9e8UPWi7b3ACZvh3)
spring.datasource.password=ENC(QsAWo7MwKI9MQP9/pt4skVyIvqLyc6gC)
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
```