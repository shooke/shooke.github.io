---
title: vue自定义组件v-model绑定数据的实现方法
categories:
  - 前端开发
tags:
  - vue
  - 自定义组件
  - v-model
date: 2019-07-19 10:02:32
---
## 代码
父组件调用
```
<list v-model="data" :multiple="true"></list>
```

子组件`list.vue`代码
```
<template>
  <el-select v-model="val" v-bind="$attrs" placeholder="请选择">
    <el-option
      v-for="item in list"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { getColumnList } from '@/api/column.js'

export default {
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: null
  },
  data () {
    return {
      list: [{id:'1',name:'张三'},{id:'2',name:'李四'}]
    }
  },
  computed: {
    val: {
      get () {
        return this.value
      },
      set (newval) {
        this.$emit('change', newval)
      }
    }
  }
}
</script>
```

<!-- more -->

实现v-model注意一下几点即可
1. model.event定义的事件名称是什么，$emit的时候出发的名称要一致。比如上面的事件名称叫`change`，这个可以随便取名字
2. model.props的值是什么，父组件使用v-model时，值就会给谁。上面的例子中值会传给`value`

注意以上两点就可以了，至于什么时机把值传递给父组件，取决于什么时候用`$emit`触发`model.event`设置的事件。比如上面使用了计算属性的方法。当`val`发生改变时，就把新的值返回。当然了，除了使用计算属性，也可以使用`watch`实现。

## 小技巧

`inheritAttrs`是默认值`true`时，所有的属性都会绑定到组件的`props`中，这为我们的组件开发提供了方便，但是有时候我们希望属性继续往下传递，就比较麻烦，这时候用`inheritAttrs: false`就方便多了。

`inheritAttrs: false`配合`$attrs`可以实现灵活的属性处理。`inheritAttrs: false`可以让父组件传递进来的(props之外的)属性收集到`$attrs`中，使用` v-bind="$attrs" `就可以将这些属性绑定到特定的组件或html元素上了。
