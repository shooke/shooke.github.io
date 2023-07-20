---
title: 解决element ui el-select控件多选时option设置为disabled，但可以删除标签，造成无法恢复的bug
categories:
  - 笔记
tags:
  - element ui
date: 2019-09-25 15:13:05
---
## 问题起因
今天遇到一个问题，需求是，客户选择栏目时，不属于自己的栏目不可修改。但需要显示出来。实现需求使用了element ui的el-select组件。
对于已选栏目的显示，和对栏目的选项取消都比较好。不属于自己的栏目使用了option的`disabled`属性。列表中的选项控制正常，对于`disabled`属性为`true`的元素不可选。
但是在展示已选则的栏目时，option中禁用的选项依然有删除的小叉号。而且还是可以使用的，点击后就被删除了。在列表中的选中状态也取消了。这可闹大了，没法恢复啊。

## 解决思路
思路很简单，在对选项进行移除时做个判断。如果选项是禁用的，就不操作。
实现中用到了`value`属性，用于显示备选项。`change`事件用于处理选中的值，`remove-tag`事件处理移除选项时的判断
有几个问题需要注意，事件的执行顺序是先出发`change`后出发`remove-tag`所以要让数据返回变为异步，保证`remove-tag`事件完成后在返回数据

<!-- more -->

## 代码
为了方便项目中使用，封装了个小组件,使用时直接载入组,件用`v-model`绑定数据就可以了很方便
```
<template>
  <el-select filterable
             :value="value"
             @change="changeHandle"
             @remove-tag="removeHandle"
             v-bind="$attrs"
             placeholder="请选择">
    <el-option v-for="item in list"
               :key="item.id"
               :label="item.name"
               :value="item.id"
               :disabled="item.disabled">
    </el-option>
  </el-select>
</template>

<script>
export default {
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: null
  },
  data () {
    return {
      selected: [],
      list: [
        {id:1,name:'a',disabled:false}},
        {id:2,name:'b',disabled:false}},
        {id:3,name:'c',disabled:true}},
      ],
      draftId: null
    }
  },
  methods: {
    changeHandle (val) {
      this.selected = val
      // 延时返回数据，主要是因为element会先执行change然后在执行remove，为了恢复不可删除的栏目，所以延时返回数据
      setTimeout(() => {
        this.$emit('input', this.selected)
      }, 10)
    },
    removeHandle (val) {
      // 检查选项是否可用
      let removeItem = this.list.find((item) => {
        return item.id === val && item.disabled === false
      })
      console.log(val, removeItem)
      // 如果找不到表示不可删除
      if (typeof removeItem === 'undefined') {
        this.selected = this.value
      } else {        
        // 如果找到可删除，则过滤
        this.selected = this.value.filter((item) => {
          return item !== val
        })
      }
    }
  }
}
</script>
```