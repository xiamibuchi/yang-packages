# ios

## 竖屏拍照上传，图片被旋转问题

```
几个步骤
1.通过第三方插件exif-js获取到图片的方向
2.new一个FileReader对象，加载读取上传的图片
3.在fileReader的onload函数中，得到的图片文件用一个Image对象接收
4.在image的onload函数中，利用步骤1中获取到的方向orientation，通过canvas旋转校正，重新绘制一张新图
注意iPhone有3个拍照方向需要处理，横屏拍摄，home键在左侧，竖屏拍摄，home建上下
5.将绘制的新图转成Blob对象，添加到FormData对象中，然后进行校正后的上传操作
```

## 页面回退到长列表出现灰色遮挡问题

方案 1：对列表数据进行缓存，比如 redux 之类的用法。
方案 2：回退时，跳到页面顶部。
const timer = setTimeout(() => {
window.scrollTo(0, 1);
window.scrollTo(0, 0);
}, 0);

## 日期转换 NAN 的问题

将日期字符串的格式符号替换成'/'。
栗子：'yyyy-MM-dd'.replace(/-/g, '/')

## 非原生 click 元素事件监听无法代理到 document 或 body 上

方案 1：元素增加`cursor: pointer`样式
方案 2：监听代理到 body 下到跟元素

## js 聚焦 input

iOS 中，[element].focus()如果直接由 js 执行，那么 element 仅会有 focused 样式，但不会唤起键盘。如果希望显示 focused 的同时唤起键盘，需要用户手动点击（可以点击非 input 元素来触发，但事件触发必须在单次事件循环中）

```js
// 监听button的click去触发input的click和focus
button.addEventListener('click', () => {
  input.click();
  input.focus();
});

// 监听button的click去触发input的.click()，再监听input的click去触发input.focus()
input.addEventListener('click', () => {
  input.focus();
});

button.addEventListener('click', () => {
  input.click();
});
// 单词事件循环中都可以正常触发 focus
```

## iOS 12 跨域 iframe 无法使用 IndexedDB

iOS 12 跨域 iframe 使用 IndexedDB 会报错。

`SecutityError: IDBFactory.open() called in an invalid security context.`
