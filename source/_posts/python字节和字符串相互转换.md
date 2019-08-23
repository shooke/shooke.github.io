---
title: python字节和字符串相互转换
categories:
  - 笔记
tags:
  - python
  - python 字符串
date: 2019-03-06 17:43:39
---
## 字符串类型

- byte 字符串
byte_str = b"byte example"

- str 字符串
str_str = "str example"

## str to bytes 字符串转字节
```
bytes(str_str, encoding="utf-8")
```
或
```
str_str.encode()
```

## bytes to str  字节转字符串
```
str(byte_str, encoding="utf-8")
```
或
```
byte_str.decode()
```