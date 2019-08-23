---
title: url添加参数
categories:
  - 笔记
tags:
  - 代码块
  - php
  - url
date: 2019-07-17 11:16:16
---
微信开发过程中经常用到获取openid后地址跳转，但是要保持原地址的所有参数，再添加上openid参数。函数很简单，也很实用，记录一下。
```
<?php
function urlAddParam($url, $params)
    {
        $urlParse = parse_url($url);

        // url协议
        $scheme = empty($urlParse['scheme']) ? '' : $urlParse['scheme'] . '://';
        // host
        $host = empty($urlParse['host']) ? '' : $urlParse['host'];
        // 端口
        $port = empty($urlParse['port']) ? '' : ':' . $urlParse['port'];
        // 执行文件
        $path = empty($urlParse['path']) ? '' : $urlParse['path'];
        // 请求参数
        $queryStr = $urlParse['query'] ?? '';
        parse_str($queryStr, $queryArr);
        $queryArr = array_merge($queryArr, $params);
        $query = http_build_query($queryArr);
        $query = empty($query) ? '' : '?' . $query;
        // 锚点链接
        $fragment = empty($urlParse['fragment']) ? '' : '#' . $urlParse['fragment'];

        return $scheme . $host . $port . $path . $query . $fragment;
    }

    echo urlAddParam('https://gitee.com/shooke/codes/new', ['openid'=>'sdfsdfoihnwoixchow==']);
```