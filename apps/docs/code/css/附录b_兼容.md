# 兼容

## iOS

### Safari 不显示滚动条

ios 下的 Safari 为了显示更多内容默认是不显示滚动条的

`-webkit-overflow-scrolling`

- `auto`(默认样式) 手指从触摸屏上移开，滚动会立即停止
- `touch` 使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果
  自动：一个手指滚动无动量.

如果你想让它永远可见

```css
/* 修改滚动条样式 */
::-webkit-scrollbar {
  /* you need to tweak this to make it available.. */
  -webkit-appearance: none;
  width: 8px;
}
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}
/* 滚动条是否可见 */
::-webkit-scrollbar  {
  display: none;
}
```
