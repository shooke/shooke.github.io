---
title: Commit log 使用说明
categories:
  - 笔记
tags:
  - git commit
  - change log
date: 2019-10-11 16:20:38
---
## 什么是git commit log
`git commit log`其实就是根据咱们提交的`commit message`信息进行提取，用来生成更新日志的功能。
既然是要生成，那就一定要有一个格式，否则程序很难自动化的处理。
目前比较常用的是[Angular 团队的规范](http://link.zhihu.com/?target=https%3A//github.com/angular/angular.js/blob/master/DEVELOPERS.md%23-git-commit-guidelines),他的格式也比较简洁。

<!-- more -->

## 规范说明
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
一个完整的`commit message`由header、body和footer构成，他们中间用一个空行分割。其中header是必须填写的，body和footer是可选项。

以上面的格式为例：
1. header说明
`<type>(<scope>): <subject>`这是header，它包括了type、scope和subject。注意书写`commit message`时不要忽略括号和冒号，这些符号。
- type是类型,可以是下面类型中的一个
   - feat: 新特性
   - fix: 修改问题
   - refactor: 代码重构
   - docs: 文档修改
   - style: 代码格式修改, 注意不是 css 修改
   - test: 测试用例修改
   - chore: 其他修改, 比如构建流程, 依赖管理.
- scope: 用于说明 commit 影响的范围，比如数据层、控制层、视图层、router等等，视项目不同而不同
- subject: 是 commit 目的的简短描述，不超过50个字符

> 如果type为feat和fix，则该 commit 将肯定出现在 Change log 之中。其他情况（docs、chore、style、refactor、test）由你决定，要不要放入 Change log，建议是不要。

2. body
   Body 部分是对本次 commit 的详细描述，可以分成多行。

3. footer
   Footer 部分只用于两种情况，一种是不兼容变动，另一种是解决bug，关闭issue。
   - 不兼容变动
   如果当前代码与上一个版本不兼容，则 Footer 部分以BREAKING CHANGE开头，后面是对变动的描述、以及变动理由和迁移方法。
   - 关闭 Issue
   如果当前 commit 针对某个issue，那么可以在 Footer 部分关闭这个 issue 。关闭一个issue可以`Closes #234`，也可以关闭多个issue`Closes #123, #245, #992`

4. Revert
   如果当前 commit 用于撤销以前的 commit，则必须以revert:开头，后面跟着被撤销 Commit 的 Header。
   ```
   revert: feat(pencil): add 'graphiteWidth' option

   This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
   ```
   Body部分的格式是固定的，必须写成This reverts commit &lt;hash>.，其中的hash是被撤销 commit 的 SHA 标识符。

   如果当前 commit 与被撤销的 commit，在同一个发布（release）里面，那么它们都不会出现在 Change log 里面。如果两者在不同的发布，那么当前 commit，会出现在 Change log 的Reverts小标题下面。

## 实例
1. 新增功能实例
```
feat(address):新增地址列表接口  

涉及文件如下
AddressControl.java 新增地址模块控制器       
AddressService.java 新增地址模块Service

BREAKING CHANGE：                       
-与前一个版本相比移除了不需要自字段XXX 
+增加了新字段XXX
```
2. bug修复实例
```
fix(user):修复了添加用户不验证用户名唯一性的问题   

修复bug涉及改动文件如下
UserModel.java 模型中增加了属性验证     
UserService.java 修改过了添加用户逻辑 

Closes #234 
```

## 生成change log
如果你的所有 Commit 都符合 Angular 格式，那么发布新版本时， Change log 就可以用脚本自动生成。生成文档一般包含3部分。
```
New features
Bug fixes
Breaking changes.
```
首先我们需要安装一个生成工具`npm install -g conventional-changelog-cli`，

> 网上说用`npm install -g conventional-changelog-cli`，但不知道为什么安装后提示找不到命令

```
npm install -g conventional-changelog-cli
cd my-project
touch CHANGELOG.md
conventional-changelog -p angular -i CHANGELOG.md -w
```
这样就可以看到change log了，log会打印到屏幕上，同时也会写入到`CHANGELOG.md`中。

上面命令不会覆盖以前的 Change log，只会在CHANGELOG.md的头部加上自从上次发布以来的变动。

如果你想生成所有发布的 Change log，要改为运行下面的命令。
```
conventional-changelog -p angular -i CHANGELOG.md -w -r 0
```
为了方便使用，可以将其写入package.json的scripts字段。
```
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w -r 0"
  }
}
```
以后，直接运行`npm run changelog`命令即可。
