---
title: vue组件之插槽
categories:
  - vue
tags:
  - vue
  - 组件
  - 插槽
  - Slots
date: 2019-05-09 09:26:11
---

这篇文章的写作时间是 vue2.6 发布后，因此适用于 2.6 以后的版本
插槽是 vue 组件中很重要的一环，他解决了组件内容自定义的问题。以及父子组件变量传递的问题（作用域插槽）。
在 2.6 以后的版本中，具名插槽和作用域插槽引入了一个新的统一的语法 (即 v-slot 指令)，它取代了 slot 和 slot-scope 。这两个老的已经进入废弃期，为了保持平滑升级，目前还可以使用，但是不推荐使用。后期会被移除。

<!-- more -->

## 简单插槽使用

`v-slot.vue`

```
<template>
  <div class="v-slot">
    <span>我是简单v-solt：</span>
    <slot>你现在看到的是默认内容</slot>
  </div>
</template>

<script>
export default {
  name: "v-slot"
};
</script>
```

在其他组件中使用

```
<v-slot></v-slot>
<v-slot>现在看到的是自定义内容</v-slot>
```

## 具名插槽使用

`v-slot-name.vue`

```
<template>
  <div class="v-slot">
    <span>我是具名v-solt-name：</span>
    <header>
      <slot name="header">header默认</slot>
    </header>
    <main>
      <slot>默认main</slot>
    </main>
  </div>
</template>

<script>
export default {
  name: "v-slot-name"
};
</script>
```

在其他模块中使用

```
<h2>新的使用方式 使用v-slot:插槽名称</h2>
    <v-slot-name>
      <template v-slot:header>
        自定义header
      </template>
      <p>没有指定v-slot名称，自定义main</p>
    </v-slot-name>

    <h2>老的使用方式 使用slot="插槽名称"</h2>
    <v-slot-name>
      <template slot="header">
        自定义header
      </template>
      <p>没有指定v-slot名称，自定义main</p>
    </v-slot-name>

    <v-slot-name>
      <template v-slot:header>
        自定义header
      </template>
      <template v-slot:default>
        指定了default，看到自定义的main
      </template>
    </v-slot-name>
```

## 作用于插槽使用

`v-slot-scope.vue`

```
<template>
  <div class="v-slot">
    <p>我是作用域插槽</p>
    <slot v-bind:user="user">
      {{ user.name }}
    </slot>
  </div>
</template>

<script>
export default {
  name: "v-slot",
  props: ["user"]
};
</script>
```

在其他模块中调用

```
<h1>作用域插槽</h1>
    <h2>新的使用方式 使用v-slot:插槽名称="组件全局变量"</h2>
    <v-slot-scope :user="user">
      <template v-slot:default="slotProps">
        这是指定插槽名称的写法
        {{ slotProps.user.name }}
      </template>
    </v-slot-scope>

    <h2>老的使用方式 使用slot="插槽名称" slot-scope="组件全局变量"</h2>
    <v-slot-scope :user="user">
      <template slot="default" slot-scope="slotProps">
        这是指定插槽名称的写法
        {{ slotProps.user.name }}
      </template>
    </v-slot-scope>

    <v-slot-scope :user="user" v-slot="slotProps">
      这是新语法中的，独占插槽的写法，省去了default插槽名称，和template标签
      {{ slotProps.user.name }}
    </v-slot-scope>
```
## 实例代码
https://gitee.com/shooke/vue-demo/tree/master/vue-demo-slot

具体参考文件如下
vuedemo/src/views/slot.vue 使用组件的视图文件
vuedemo/src/components/v-slot-name.vue 具名插槽组件
vuedemo/src/components/v-slot-scope.vue 作用域插槽组件
vuedemo/src/components/v-slot.vue 普通域插槽组件