---
title: 解决maven依赖问题
categories:
  - 笔记
tags:
  - maven
date: 2024-07-09 20:06:28
---
## 起因
由于项目比较老，下载下来以后，发现maven依赖好多找不到了。找同事要了包，放到了对应的本地仓库目录下还是不行。
报错信息如下
```
Could not find artifact com.github.everit-org.json-schema:org.everit.json.schema:pom:1.11.1 in aliyunmaven (https://maven.aliyun.com/repository/public)
```

## 解决办法
1. 删除本地仓库中的包
2. 使用命令将依赖安装到本地仓库
```
 mvn install:install-file -Dfile=path/to/your/jar/file.jar -DgroupId=com.github.everit-org.json-schema -DartifactId=org.everit.json.schema -Dversion=1.11.1 -Dpackaging=jar

```
3. 打开idea刷新mavne依赖，发现已经正常了