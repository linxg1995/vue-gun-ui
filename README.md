# vue-gun-ui
vue-gun-ui是基于vue设计的UI组件库，主要用于个人学习。
个人联系邮箱：262318769@qq.com

## 安装
``` bash
$ npm i vue-gun-ui
```

## 组件概述

### ScrollContainer 滚动块容器
参考 [Element UI](https://element.eleme.cn/#/zh-CN)，自己试着写了一个自定义的滚动条，并把它跟div结合成一个带有自定义滚动条的块容器。
需要注意的是，需要定义元素的高度height。
#### Props
| 属性 | 说明 | 类型 | 默认值 | 可选值 |
| :- | :- | :- | :- | :- |
| showX | 显示X滚动条； | Boolean | false | - |
#### Events
| 事件名称 | 说明 | 返回值 |
| :- | :- | :- |
| scroll | 滚动时的触发 | 原生Event事件对象 |
#### Slots
| 插槽名称 | 说明 |
| :- | :- |
| - | 默认。容器中的内容 |