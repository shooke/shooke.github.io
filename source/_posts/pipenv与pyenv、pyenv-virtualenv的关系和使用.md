---
title: pipenv与pyenv、pyenv-virtualenv的关系和使用
categories:
  - python
tags:
  - python
  - pipenv
  - pyenv
  - pyenv-virtualenv
date: 2019-06-20 09:20:23
---
## 为什么要有版本管理

我们举个例子：

1. 项目一要求用python 2.x
2. 项目二要去python 3.x

如果服务器上要运行这两个项目，就需要安装两个版本。如果项目更多，需要的版本也越多，我们就需要有版本管理的概念。

## 为什么要有虚拟版本

上面我们看到，版本管理解决了，不同项目对python版本的需求。如果我们服务器上有增加了一个项目，情况如下，如果解决呢

1. 项目一要求用python 2.x
2. 项目二要去python 3.x，要求导入的requests包是1.x
3. 项目三要去python 3.x，要去导入的requests包是2.x

我们看到项目二和项目三要去的是同样的版本，但是依赖的包是不同版本的，我们无法在一个版本上，同一个包安装不同的版本。这样容易造成混乱。因此就需要虚拟环境了。虚拟环境就是在所需的版本上，创建一个副本，在副本里进行依赖包的管理，这样不同的项目用自己的副本，就不会相互干扰。

<!-- more -->

## 关系
1. **pyenv** 用来管理python版本，比如系统中有一个2.x的版本，安装pyenv后可以，使用pyenv安装其他版本的python，让系统可以同时支持多个版本。而且不影响系统版本。
2. **pyenv-virtualenv** 用来创建虚拟环境，让不同的项目拥有自己独立的运行环境，避免相互干扰。
3. **pipenv** 它有两个功能，一个是管理依赖（替代pip管理工具）。二是可以创建虚拟环境(使用方式与pyenv-virtualenv有所差别)。

简单点说就是，安装`pyenv`后，再安装`pipenv`。就可以满足日常的开发需求。如果对于虚拟环境的要求比较高，可以安装一下`pyenv-virtualenv`。后面具体讲解一下他们的功能。根据实际需求做出选择即可。
## 使用策略
1. 安装pyenv和pipenv，基本可以满足日常开发需求，可以使用pipenv去管理依赖包，和虚拟环境
2. 安装pyenv、pipenv和pyenv-virtualenv，三个都安装的情况下，我们可以使用pipenv管理依赖包，用pyenv-virtualenv来管理虚拟环境，pyenv配合pyenv-virtualenv切换版本，使用起来比单独使用pipenv或pyenv-virtualenv，都方便许多。

## pyenv使用
### pyenv安装
pyenv不支持windows，只支持mac和linux。官方提供了一个安装脚本，安装起来非常简单，它会自动安装`pyenv`和`pyenv-virtualenv`

1. 执行以下命令开始安装
```
curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash
```
2. 安装完成后需要配置环境变量，根据提示处理即可。
一般情况是在 ~/.bashrc 里添加如下代码
```
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

### pyenv卸载
pyenv安装后会在用户家目录创建一个`.pyenv`的文件夹。如果要卸载，直接删除这个文件夹，然后将`~/.bashrc`中，安装时添加的3行代码删除，就可以了。
删除`.pyenv`
```
rm -rf $(pyenv root)
# 或
# rm -rf ~/.pyenv
```

### 常用命令
1. 版本管理
`pyenv versions` 查看本机已有版本
`pyenv install -l` 查看可安装的版本
`pyenv install 2.7.3` 安装指定的版本
`pyenv uninstall 2.7.3` 卸载指定的版本

2. 切换版本，分为3种，按优先级排序:shell local global

`pyenv shell 2.7.3` 设置面向 shell 的 Python 版本，通过设置当前 shell 的 PYENV_VERSION 环境变量的方式。这个版本的优先级比 local 和 global 都要高。`–unset` 参数可以用于取消当前 shell 设定的版本 `pyenv shell --unset`。
`pyenv local 2.7.3` 设置 Python 本地版本，通过将版本号写入当前目录下的 .python-version 文件的方式。通过这种方式设置的 Python 版本优先级较 global 高。这种方式，每次进入目录，执行python命令运行脚本时，会自动使用设置的版本。而且不会影响全局环境
`pyenv global 2.7.3`  设置全局的 Python 版本，通过将版本号写入 ~/.pyenv/version 文件的方式。这种方式会营销全局环境，要谨慎使用
`pyenv rehash` 创建垫片路径（为所有已安装的可执行文件创建 shims，如：~/.pyenv/versions/*/bin/*，因此，每当你增删了 Python 版本或带有可执行文件的包（如 pip）以后，都应该执行一次本命令）

3. 虚拟环境管理

`pyenv virtualenv 2.7.10 env-2.7.10` 创建虚拟环境，若不指定 python 版本，会默认使用当前环境 python 版本。如果指定 Python 版本，则一定要是已经安装过的版本，否则会出错。环境的真实目录位于 ~/.pyenv/versions 下
`pyenv virtualenvs` 列出当前虚拟环境
`pyenv activate env-name`   激活虚拟环境
`pyenv deactivate` 退出虚拟环境，回到系统环境
`pyenv uninstall my-virtual-env` 删除虚拟环境，或者直接删除目录`rm -rf ~/.pyenv/versions/env-name`

>小技巧
pyenv切换版本，也可以使用虚拟环境，比如可以使用`pyenv local env-name`，来达到当前目录使用虚拟环境的目的。相比`pyenv activate env-name`更加方便，每次进入目录自动切换版本。

## pipenv使用
### pipenv安装
使用pip安装即可
```
pip install pipenv
```
想要shell 自动补齐，Linux or Mac 环境下，bash下如果能自动命令补全岂不是更好？请把如下语句追加到.bashrc或者.zshrc即可：
```
eval "$(pipenv --completion)"
```
### pipenv常用命令
`pipenv --python 3.6` 创建虚拟环境,pipenv 会自动扫描系统寻找合适的版本信息，如果找不到的话，同时又安装了 pyenv 的话，则会自动调用 pyenv 下载对应版本的 python， 否则会报错。
`pipenv shell`      进入虚拟环境
`pipenv install urllib3`    安装虚拟环境或者第三方库,也可以指定版本`pipenv install urllib3==1.22`
`pipenv uninstall urllib3`  卸载一个库，全部卸载使用`pipenv uninstall --all`
`pipenv update urllib3`     更新指定包，不带参数`pipenv update`会卸载当前所有的包，并安装它们的最新版本
`pipenv --where` 查看项目根目录
`pipenv --venv` 查看虚拟环境目录
`pipenv run`        在虚拟环境中运行命令
`pipenv check`      检查安全漏洞
`pipenv graph`      显示当前依赖关系图信息
`pipenv lock`       锁定并生成Pipfile.lock文件
`pipenv open`       在编辑器中查看一个库


## 参考资料
https://github.com/pyenv/pyenv
https://github.com/pyenv/pyenv-installer
https://github.com/pypa/pipenv
https://segmentfault.com/a/1190000015389565