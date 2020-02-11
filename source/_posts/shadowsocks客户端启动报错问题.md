---
title: shadowsocks客户端启动报错问题
categories:
  - 笔记
tags:
  - shadowsocks
date: 2020-02-11 11:11:19
---
## 问题描述
```
sslocal -c shadowsocks.json
```
报如下错误
```
INFO: loading config from shadowsocks.json
2020-02-11 10:50:45 INFO     loading libcrypto from libcrypto.so.1.1
Traceback (most recent call last):
  File "/usr/local/bin/sslocal", line 11, in <module>
    sys.exit(main())
  File "/usr/local/lib/python2.7/dist-packages/shadowsocks/local.py", line 39, in main
    config = shell.get_config(True)
  File "/usr/local/lib/python2.7/dist-packages/shadowsocks/shell.py", line 262, in get_config
    check_config(config, is_local)
  File "/usr/local/lib/python2.7/dist-packages/shadowsocks/shell.py", line 124, in check_config
    encrypt.try_cipher(config['password'], config['method'])
  File "/usr/local/lib/python2.7/dist-packages/shadowsocks/encrypt.py", line 44, in try_cipher
    Encryptor(key, method)
  File "/usr/local/lib/python2.7/dist-packages/shadowsocks/encrypt.py", line 83, in __init__
    random_string(self._method_info[1]))
  File "/usr/local/lib/python2.7/dist-packages/shadowsocks/encrypt.py", line 109, in get_cipher
    return m[2](method, key, iv, op)
  File "/usr/local/lib/python2.7/dist-packages/shadowsocks/crypto/rc4_md5.py", line 33, in create_cipher
    return openssl.OpenSSLCrypto(b'rc4', rc4_key, b'', op)
  File "/usr/local/lib/python2.7/dist-packages/shadowsocks/crypto/openssl.py", line 76, in __init__
    load_openssl()
  File "/usr/local/lib/python2.7/dist-packages/shadowsocks/crypto/openssl.py", line 52, in load_openssl
    libcrypto.EVP_CIPHER_CTX_cleanup.argtypes = (c_void_p,)
  File "/usr/lib/python2.7/ctypes/__init__.py", line 379, in __getattr__
    func = self.__getitem__(name)
  File "/usr/lib/python2.7/ctypes/__init__.py", line 384, in __getitem__
    func = self._FuncPtr((name_or_ordinal, self))
AttributeError: /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1: undefined symbol: EVP_CIPHER_CTX_cleanup

```
<!-- more -->

## 原因
原因是openssl1.1.0版本中，废弃了`EVP_CIPHER_CTX_cleanup`函数改用`EVP_CIPHER_CTX_reset`替代

## 解决方法
解决方法很简单，找到报错文件`/usr/local/lib/python2.7/dist-packages/shadowsocks/crypto/openssl.py`将出错的函数改掉就可以了

```
sudo vi /usr/local/lib/python2.7/dist-packages/shadowsocks/crypto/openssl.py
```
找到`EVP_CIPHER_CTX_cleanup`替换为`EVP_CIPHER_CTX_reset`，一共有两处需要替换

替换后保存退出，执行`sslocal -c shadowsocks.json`重新启动就ok了

## 参考资料
https://kionf.com/2016/12/15/errornote-ss/