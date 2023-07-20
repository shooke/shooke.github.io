---
title: elasticsearch模糊查询
date: 2019-01-23 12:15:36
categories:
- 笔记
tags:
- elasticsearch
---

like %李四% 可以使用以下语法
```
{
    "match_phrase": {
        "nickname": {"query":"李明"}
    }
}
```
或
```
{
    "wildcard": {
        "nickname.keyword": "*李明*"
    }
}
```