---
title: vuex getters不更新的奇怪现象解决方案
categories:
  - vue
tags:
  - vue
  - vuex
  - getters
date: 2019-05-23 00:19:41
---

今天写代码的时候遇到一个很奇怪的问题，getter里面取到的值怎么都不是最新的。
调用setAuth清空后，从vue开发工具(vue-Devtools)中查看，`state.auth`已经正常被设置成了空值。但是`getters`或`mapGetters`取到的还是更新前的值。
<!-- more -->
代码如下：
```
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    auth: ""
  },
  getters: {
    getAuth(state) {
      let localuser = window.localStorage.getItem("auth");
      if (localuser) {
        return localuser;
      }
      return state.auth;
    }
  },
  mutations: {
    setAuth(state, value) {
      window.localStorage.setItem("auth", value);
      state.auth = value;
      // Vue.set(state, "auth", value);
    }
  }
});
```

网上查了资料，有人说是无法跟踪`state`，让使用`Vue.set(state, "auth", value)`，就是上面注释掉的代码。但其实也是无效的。
最后终于找到了解决方法，那就是在getters的方法里面一定要返回`state.auth`,绝对不能返回其他值。最终修改后是下面的样子
```
import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
Vue.use(Vuex);

export default new Vuex.Store({
  state,
  getters: {
    getAuth(state) {
      let localuser = window.localStorage.getItem("auth");
      if (localuser) {
        state.auth = localuser;
      }
      return state.auth;
    }
  },
  mutations: {
    setAuth(state, value) {
      window.localStorage.setItem("auth", value);
      state.auth = value;
      // Vue.set(state, "auth", value);
    }
  }
});
```