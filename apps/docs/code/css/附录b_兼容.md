# 兼容

## ios

### Safari 不显示滚动条

ios 下的 Safari 为了显示更多内容默认是不显示滚动条的

`-webkit-overflow-scrolling`

- `auto`(默认样式) 手指从触摸屏上移开，滚动会立即停止
- `touch` 使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果
  自动：一个手指滚动无动量.

另一种可用的风格是

-webkit-overflow-scrolling：touch

触摸：原生滚动.指定此样式具有创建条带上下文(如不透明度,掩码和转换)的效果.

使用触摸模式,当用户触摸和滚动时,滚动条将可见,但在不使用时会消失

如果你想让它永远可见

```CSS
/* 修改滚动条样式 */
::-webkit-scrollbar {
    -webkit-appearance: none;// you need to tweak this to make it available..
    width: 8px;
}
::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,.5);
    box-shadow: 0 0 1px rgba(255,255,255,.5);
}
/* 滚动条是否可见 */
::-webkit-scrollbar {
 display: none;
}
```
