# 图片

- 位图（bitmap）：像素点组成
- 矢量图（vector）：用几何形状描述图片

## 图片格式

- BMP：无损
- JPEG/JPG
  - 线性加载（Baseline JPEG）
  - 一种是渐进式加载（Progressive JPEG）
- GIF
- PNG：无损压缩格式，分 PNG 8/ PNG 24 / PNG 32。位数越高，存储的颜色就越多(2^n)
- WEBP：能同时支持无损压缩和有损压缩
- svg
- AVIF：基于 AV1 的视频压缩技术的图片格式

## 图片懒加载

```js
const images = document.querySelectorAll('.lazyload');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((item) => {
      if (item.isIntersecting) {
        item.target.src = item.target.dataset.src; // 开始加载图片,把data-src的值放到src
        observer.unobserve(item.target); // 停止监听已开始加载的图片
      }
    });
  },
  {
    rootMargin: '0px 0px -100px 0px', // 交叉过视图的100，才开始派发事件
  }
);
images.forEach((item) => observer.observe(item));
```

## 响应式

```html
<picture>
  <source srcset="large.png" media="(min-width: 1200px)" />
  <source srcset="middle.png" media="(min-width: 992px)" />
  <source srcset="small.png" media="(min-width: 768px)" />
  <img src="small.png" />
</picture>
```

## 错误处理

- 监听 onerror 事件替换兜底图
- 设置 error 样式

```css
img.error::after {
  content: attr(alt);
}
```
