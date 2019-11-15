---
title: js实现防抖和节流
categories:
  - 笔记
tags:
  - javascript
  - 防抖
  - 节流
date: 2019-11-15 10:32:50
---

防抖和节流是避免过度处理的有效手段。目的就是为了解决一些事件频繁的触发问题。

## 防抖
先说一下防抖，当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时。

> 通俗易懂点就是，领导安排任务，你得等领导全部说完了再去做，不能说一个就跑去做了，你得等领导说完。

举个很典型的例子，搜索提示是个很典型的使用场景。每次输入框的内容发生更改就会发送一个请求，这其实是没有必要的。
理想的方式应该是当用户不在输入时，在发送请求。怎么确定用户停止输入呢？我们定义一个等待时间，比如500ms。当用户停止输入500ms后发送一个请求。
500ms内如果在不停的输入内容，那我们就重新重新计时。

简单例子

```
// 防抖  定时器
let timer;

// 监听input事件
this.$refs.search.$el.addEventListener("input", e => {
  console.log('不防抖')
	if (timer) {
		//清空timer
		clearTimeout(timer);
	}
	timer = setTimeout(() => {
		console.log('防抖')	//使用防抖	
	}, 75);		//75mm为最佳
});
```
进行一下封装
```
function debounce(func, wait, immediate) {

    var timeout, result;

    var debounced = function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                result = func.apply(context, args)
            }, wait);
        }
        return result;
    };

    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
}
```
这里的借用了`冯羽`的代码https://juejin.im/post/5931561fa22b9d0058c5b87d#heading-3

## 节流
与防抖不同，节流是用来控制节奏的，他不会象防抖那样，一直无限期的后延。而是执行一个时间段内的最后一次指令。

> 通俗易懂点就是，老板给你安排任务，要求一周完成。但是在做的过程中需求老是变化，你就不行抛弃以前的工作，只按最新需求做，到了交付日期，按照最终需求交付。

比如滚动事件，持续触发scroll事件时，并不立即执行handle函数，每隔1000毫秒才会执行一次handle函数。

代码实例
```
var throttle = function(func, delay) {
     var timer = null;
     var startTime = Date.now();
     return function() {
             var curTime = Date.now();
             var remaining = delay - (curTime - startTime);
             var context = this;
             var args = arguments;
             clearTimeout(timer);
              if (remaining <= 0) {
                    func.apply(context, args);
                    startTime = Date.now();
              } else {
                    timer = setTimeout(func, remaining);
              }
      }
}
function handle() {
      console.log(Math.random());
}
 window.addEventListener('scroll', throttle(handle, 1000));
```

## 参考资料
https://juejin.im/entry/5b1d2d54f265da6e2545bfa4
https://juejin.im/post/5dccb36de51d45105d563105?utm_source=gold_browser_extension#heading-4
https://juejin.im/post/5b8de829f265da43623c4261#heading-4