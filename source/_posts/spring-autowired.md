---
title: spring官方建议不要使用@Autowired，完美解决方案
categories:
  - 笔记
tags:
  - spring
date: 2023-07-20 19:06:28
---

Springboot官方建议使用final来修饰成员变量，然后通过构造方法来进行注入。原因：final修饰的成员变量是不能够被修改的，反射除外。

既然不推荐使用Autowired了，应该如何修改我们的代码呢？

<!-- more -->

当前代码如下
```
@RestController
@RequestMapping("/terminalLocation")
public class TerminalLocationController {

    @Autowired
    private TerminalLocationService terminalLocationService;

    @PostMapping("/confirm")
    public RestResponse<String> confirm(@RequestParam("id") Integer id){
        terminalLocationService.confirm(id);
        return RestResponse.success("确认成功");
    }

}
```
按照官方的说法我吗应该这样修改，去掉`@Autowired`，给属性添加`final`修饰符，创建构造函数
```
@RestController
@RequestMapping("/terminalLocation")
public class TerminalLocationController {
    
    private final TerminalLocationService terminalLocationService;

    public TerminalLocationController(TerminalLocationService terminalLocationService) {
        this.terminalLocationService = terminalLocationService;
    }

    @PostMapping("/confirm")
    public RestResponse<String> confirm(@RequestParam("id") Integer id){
        terminalLocationService.confirm(id);
        return RestResponse.success("确认成功");
    }

}
```
但是这样写好麻烦啊，每次添加一个依赖都要修改构造函数。好在我们有`lombok`，只需要添加一个`@AllArgsConstructor`注解，就可以帮我们生成构造函数了，代码简化为这样
```
@RestController
@RequestMapping("/terminalLocation")
@AllArgsConstructor
public class TerminalLocationController {

    private final TerminalLocationService terminalLocationService;

    @PostMapping("/confirm")
    public RestResponse<String> confirm(@RequestParam("id") Integer id){
        terminalLocationService.confirm(id);
        return RestResponse.success("确认成功");
    }

}
```
这样虽然解决了自定生成构造函数的问题，但是，`@AllArgsConstructor`会给把所有属性都加入到构造函数中。这样就会带来一个问题，如果我们有一个属性使用了`@Value`也会被构造函数的参数覆盖。
如何解决呢？
通常使用`@Value`的属性我们通常是可以修改的，因此不会加上`final`修饰符
我们只把加入了`final`修饰符的属性加入到构造函数中就可以了，这时候使用`@RequiredArgsConstructor`注解就可以了
```
@RestController
@RequestMapping("/terminalLocation")
@RequiredArgsConstructor
public class TerminalLocationController {

    private final TerminalLocationService terminalLocationService;

    @PostMapping("/confirm")
    public RestResponse<String> confirm(@RequestParam("id") Integer id){
        terminalLocationService.confirm(id);
        return RestResponse.success("确认成功");
    }

}
```

## 总结
完美方案是，在类上使用`@RequiredArgsConstructor`注解，属性去掉`@Autowired`注解，添加`final`修饰符。