---
title: python mysql-connector简要说明
categories:
  - 笔记
tags:
  - python
  - mysql-connector
date: 2020-02-14 16:38:09
---

## 安装插件
```
python -m pip install mysql-connector
```

## 建立链接
```
import mysql.connector
 
# 接收参数：user, password, host, port=3306, unix_socket and database
# 返回一个MySQLConnection Object
config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'root',
    'port': 3306,
    'database': 'test',
    'charset': 'utf8'
}
try:
    cnn = mysql.connector.connect(**config)
except mysql.connector.Error as e:
    print('connect fails!{}'.format(e))

```
conn就是mysql的链接对象，它可以提交开启事务、提交、回滚，也可以关闭来mysql断开链接

## 查询操作
执行查询，需要经过以下几个过程：
1. 获取一个游标，数据操作都是基于游标来处理。链接的cursor方法会返回一个游标，如上面`conn.cursor()`就会返回游标。
2. 调用游标的execute方法，执行sql。
3. 获取执行结果，我们可以用fetchone()一次获取一条记录，也可以用fetchall()，一次性获取所有记录。
```
cursor = cnn.cursor()
try:
    sql_query = 'select name,age from stu ;'
    cursor.execute(sql_query)
    for name, age in cursor:
        print (name, age)
except mysql.connector.Error as e:
    print('query error!{}'.format(e))
finally:
    cursor.close()
    cnn.close()
```
### 获取全部数据
```
cmd = conn.cursor()
# 执行一条原生的SQL语句，执行结果保存在cmd中，没有返回值
cmd.execute("select id, name, age from stu")
# 可以使用fetchall()，获取所有的查询结果集，返回值为一个tuple，每一个元素是一个list
res = cmd.fetchall()
print(res)
# [(1, 'LiMing', 20), (2, 'XiaoHua', 30), (3, 'LiLei', 10)]

```

### 获取一条数据
```
cmd = conn.cursor()
 
cmd.execute("select id, name, age from stu")
 
# 使用fetchone()返回一条结果集，每调用一次之后，内部指针会指向下一条结果集
print(cmd.fetchone()) # (1, 'LiMing', 20)
print(cmd.fetchone()) # (2, 'XiaoHua', 30)
print(cmd.fetchone()) # (3, 'LiLei', 10)

```

### 一次获取n条数据
```
cmd = conn.cursor()
 
cmd.execute("select * from stu")
 
res = cmd.fetchmany(2)   # 指定返回2条记录
print(res)
# [(1, 'LiMing', 20), (2, 'XiaoHua', 30)]
 
res = cmd.fetchmany(1)   # 指定返回1条记录
print(res)
# [(3, 'LiLei', 10)]
```

## 插入操作
```
# 创建一个查询
cmd = conn.cursor()
 
# 执行原生SQL语句
cmd.execute("insert into stu (id, name, age) values (4, 'LiBai', 99)")
print(cmd.rowcount)  # 1
 
```

## 更新操作
```
# 创建一个查询
cmd = conn.cursor()
 
# 执行原生SQL语句
cmd.execute("update stu set name='张三'")
print(cmd.rowcount)  # 1
 
cmd.execute("select * from stu")
res = cmd.fetchall()
print(res)
# [(1, 'LiMing', 20), (2, 'XiaoHua', 30), (3, 'LiLei', 10), (4, 'LiBai', 99)]
```

>知识点
fetchone() 一次获取一条数据，每执行一次游标自动移动到下一条，直到数据全部读出。
fetchmany(5) 一次获取5条数据，没执行一次游标向后移动，直到数据全部读出。
fetchall() 一次获取所有数据

## 预处理
前面的例子都是直接执行sql语句，这样存在一定的危险性。预处理是不错的方式。execute方法支持3个参数：
- 第一个参数是执行的sql，sql中的参数可以使用具体内容，也可以使用占位符
- 第二个参数，是当以一个参数使用了占位符时用到的，参数类型是一个元组(tuple),元祖的元素个数，根据第一个参数中的占位符个数决定
- 第三个表示第一个参数是不是多个SQL语句，如果是的话，就传入True，否则传入False
### 查询
```
cmd = conn.cursor()
 
# 注意，在SQL中的占位符，统一写%s, 具体的类型，是在tuple中，传入的参数元素类型决定
cmd.execute("select * from stu where id=%s and name=%s", (1, 'LiMing'))
res = cmd.fetchall()
print(res)
# [(1, 'LiMing', 20)]

# 如果占位符只有一个，则tuple中要有一个逗号，这是tuple定义需要注意的
cmd.execute("select * from stu where id=%s ", (1,))
res = cmd.fetchall()
print(res)
# [(1, 'LiMing', 20)]

```
### 更新、删除

```
# 删除
cmd.execute("delete from stu  where id=%s ", (2,))
# 注意，如果是更新操作一定要执行commit，否则数据库不会更新
cmd.execute("update stu set name='lisi' where id=%s ", (1,))
conn.commit()
# 如果占位符只有一个，则tuple中要有一个逗号，这是tuple定义需要注意的
cmd.execute("select * from stu where id=%s ", (1,))
res = cmd.fetchall()
print(res)
# [(1, 'lisi', 20)]
```
上面的操作如果去掉conn.commit()，输出结果也会是`[(1, 'lisi', 20)]`，但进入数据库查看，数据库的内容并不会更新。

> 知识点
预处理时，python会实时得知sql执行的最终结果。但是如果不执行`commit()`数据库内的数据不会真正更新。


## 参考资料
https://www.cnblogs.com/-beyond/p/9798970.html
https://www.cnblogs.com/xiaohuomiao/p/10729818.html