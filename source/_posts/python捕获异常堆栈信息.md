---
title: python捕获异常堆栈信息
categories:
  - 笔记
tags:
  - python
  - 异常
date: 2020-08-13 13:07:32
---
python的异常对称相比java或php简单了很多，对象中的信息很少，只有简单的错误输出。这在开发过程中是无法满足使用需求的。我们还需要更多的错误信息，比如错误发生在哪一行，具体的错误信息是什么。这就需要获取错误堆栈信息。下面简单记录一下常用的集中异常处理。

<!-- more -->

## 最简单的异常处理
```
try:
    a = {}
    print(a["name"])
except Exception as e:
    print(e)
```
我们得到的信息是
```
'name'
```
之所以出现`‘name’`错误，是因为咱们的字典`a`中没有`name`这个key。但这样的异常对我们来说毫无意义。

## repr带点说明的异常处理
```
try:
    a = {}
    print(a["name"])
except Exception as e:
    print(repr(e))
```
我们得到信息是
```
KeyError('name')
```
这次使用了`repr`输出的信息总算是有点意义了，他让我们知道错误是因为一个`KeyError`。但这还不够我们需要知道错误发生在什么地方

## logging.exception显示异常发生位置
```
import logging

try:
    a = {}
    print(a["name"])
except Exception as e:
    logging.exception(e)
```
使用了`logging.exception`这次得到的信息就更加的丰富了，不但提示了错误，还指出了发生的所在行
```
ERROR:root:'name'
Traceback (most recent call last):
  File "/var/www/gubeichun/gbcdata/test/test.py", line 8, in <module>
    print(a["name"])
KeyError: 'name'
```

## 使用traceback模块处理异常

### 直接打印错误信息
除了使用`logging.exception`还可以使用`traceback`模块来处理异常，更加方便
```
import traceback

try:
    a = {}
    print(a["name"])
except Exception as e:
    traceback.print_exc()
    # msg = traceback.format_exc()
    # print(msg)
```
这次得到的错误信息是
```
Traceback (most recent call last):
  File "/var/www/gubeichun/gbcdata/test/test.py", line 8, in <module>
    print(a["name"])
KeyError: 'name'
```
这样的错误比起`logging.exception`清爽了一些。`traceback.print_exc()`也是直接打印错误。

### 获取错误信息，自行处理
有时候我们不希望错误被打印，而是希望接收错误，自己保存日志，这时候只要把`print_exc()`换成`format_exc()`就可以了

## 使用sys和traceback模块处理异常

### 直接打印错误信息
`traceback`输出的错误信息，已经非常好了，但有时候我们希望更加个性话的处理日志，这时候就需要用到`sys`模块和`traceback`模块做个配合。
其实`print_exc()`只不过是对`print_exception`的封装。下面这样写，会得到`print_exc`一样的错误信息。

```
import traceback
import sys

try:
    a = {}
    print(a["name"])
except Exception as e:
    et, ev, tb = sys.exc_info()
    traceback.print_exception(et, ev, tb)
```
错误信息跟`print_exc`一样
```
Traceback (most recent call last):
  File "/var/www/gubeichun/gbcdata/test/test.py", line 8, in <module>
    print(a["name"])
KeyError: 'name'
```
如果只想输出错误所在行的信息可以使用`print_tb`
```
import traceback
import sys
try:
    a = {}
    print(a["name"])
except Exception as e:
    et, ev, tb = sys.exc_info()
    traceback.print_tb(tb)
```
这样就得到了，更清爽的错误信息
```
 File "/var/www/gubeichun/gbcdata/test/test.py", line 8, in <module>
    print(a["name"])
```

### 获取错误信息，自行处理
`traceback`还提供了一个`format_exception`方法，他会将错误信息处理成一个可迭代对象，让我们更方便的处理错误信息
```
import traceback
import sys

try:
    a = {}
    print(a["name"])
except Exception as e:
    et, ev, tb = sys.exc_info()
    msg = traceback.format_exception(et, ev, tb)
    for m in msg:
        print(m)
```





