<script setup>
import CanvasDemo from './components/CanvasDemo.vue'
</script>

# canvas

[标准](https://html.spec.whatwg.org/multipage/canvas.html)

canvas 提供了一个空白的图形区域，可以使用特定的 JavaScript API 来绘画图形（canvas 2D 或 WebGL）

## api

- getContext：获取渲染上下文

### 直线

- moveTo(x, y)：移动画笔
- lineTo(x, y)：直线
- stroke()：描边，根据路径绘制线

### 矩形

- strokeRect(x, y, width, height) 绘制一个矩形的边框
- fillRect(x, y, width, height) 绘制一个填充的矩形
- clearRect(x, y, width, height) 清除指定矩形区域，让清除部分完全透明

### 圆弧

arc(x, y, radius, startAngle, endAngle, anticlockwise)：x 和 Y 为圆心的坐标，radius 为半径，startAngle 为圆弧或圆的开始位置，endAngle 为圆弧或圆的结束位置，anticlockwise 是绘制的方向（不写默认为 false，从顺时针方向）

### 椭圆

ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)

- x、y：椭圆的圆心位置
- radiusX、radiusY：x 轴和 y 轴的半径
- rotation：椭圆的旋转角度，以弧度表示
- startAngle：开始绘制点
- endAngle：结束绘制点
- anticlockwise：绘制的方向（默认顺时针），可选参数

### 贝塞尔曲线

quadraticCurveTo(cp1x, cp1y, x, y)，其中 cp1x 和 cp1y 为一个控制点，x 和 y 为结束点

### 样式

- lineWidth：当前绘线的粗细。属性值必须为正数。默认值是 1.0
- lineCap：线段端点显示的样子。可选值为：butt，round 和 square。默认是 butt
- lineJoin：两线段连接处所显示的样子。可选值为：round, bevel 和 miter。默认是 miter

### 设置宽高注意点

可以使用 html 属性 `width` 和 `height`来设置，不要使用 CSS 样式来设置宽高

使用 属性设置宽高，实际上相当于增加了 canvas 画布的像素
默认宽高： 300\*150，表示：水平方向有 300 个像素，垂直方向有 150 个像素
使用属性设置宽高，是增加或减少了 canvas 画布的像素；
而使用 css 样式，不会增加像素点，只是将每个像素点扩大了。

### 画布 demo

<CanvasDemo />

```js
/* <canvas id="canvas" width="200" height="200">
  当前浏览器不支持canvas元素，请升级或更换浏览器！
</canvas> */
const canvas = document.getElementById('canvas');
// CanvasRenderingContext2D 二维渲染上下文
const ctx = canvas?.getContext('2d');
// WebGLRenderingContext 三维渲染上下文对象
const ctx = canvas?.getContext('webgl');
// WebGL2RenderingContext 三维渲染上下文对象。只在实现 WebGL 版本2 (OpenGL ES 3.0)的浏览器上可用
const ctx = canvas?.getContext('webgl2');

// 直线
ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.moveTo(50, 50); // 移动画笔至 50, 50
ctx.lineTo(200, 200); // 画一条线段至 200, 200
ctx.lineTo(200, 50);
ctx.lineTo(50, 50);
ctx.stroke(); // 描边：根据路径绘制线

ctx.lineWidth = 1;
ctx.lineCap = 'butt';

// 矩形
ctx.strokeRect(50, 50, 200, 100);

// 实心矩形
ctx.fillRect(0, 0, 50, 50);

// 清空区域
// clearRect(x, y, width, height);
ctx.clearRect(10, 10, 25, 25);

// 圆弧
// arc(x, y, radius, startAngle, endAngle, anticlockwise);
ctx.arc(60, 60, 60, 0, Math.PI * 2, false);
ctx.stroke();

// 椭圆
// ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
ctx.ellipse(50, 250, 50, 100, 0, 0, 2 * Math.PI);
ctx.stroke();

// 二次贝塞尔曲线
// quadraticCurveTo(cp1x, cp1y, x, y);
ctx.moveTo(0, 0);
ctx.quadraticCurveTo(150, 150, 350, 50);
ctx.stroke();
```

## canvas 的基本使用

### canvas 中的坐标系

- canvas 坐标系，从最左上角 0,0 开始。x 向右增大， y 向下增大
  - 联想：CSS 中的盒模型

### 绘制直线的常用 API

- 步骤：先绘制路径再描边（在画布中展示）

#### moveTo -设置绘制起点

- 语法：ctx.moveTo(x, y);
- 解释：设置上下文绘制路径的起点。相当于移动画笔到某个位置
- 参数：x,y 都是相对于 canvas 盒子的坐标。
- 注意：**绘制线段前必须先设置起点，不然绘制无效。**

#### lineTo -绘制直线

- 语法：ctx.lineTo(x, y);
- 解释：从 x,y 的位置绘制一条直线到起点或者上一个线头点。
- 参数：x,y 线头点坐标。

#### stroke -描边

- 语法：ctx.stroke();
- 解释：根据路径绘制线。路径只是草稿，真正绘制线必须执行 stroke

#### 练习

- 绘制正方形、三角形和梯形

```html
- <img src="imgs/stroke-line-exc-1.png" width="600" height="400" />
```

### fill -填充

- 语法：ctx.fill();
- 解释：填充，是将闭合的路径的内容填充具体的颜色, 默认黑色。
- 如果所有的描点没有构成封闭结构，也会自动构成一个封闭图形

### 线宽

- 语法：ctx.lineWidth
- 解释：设置或返回当前的线条宽度，沿着起始坐标往上下两边扩展

### 描边和填充的样式说明

- fillStyle : 设置或返回用于填充绘画的颜色
- strokeStyle: 设置或返回用于描边的颜色

以上两个值都可以接受：颜色名、16 进制数据、rgb 值，甚至 rgba.
一般先进行设置样式然后进行绘制。

```js
ctx.strokeStyle = 'red';
ctx.strokeStyle = '#ccc';
ctx.strokeStyle = 'rgb(255,0,0)';
ctx.strokeStyle = 'rgba(255,0,0,6)';
```

#### 非零环绕原则

- 注意：交叉路径的填充问题，“非零环绕原则”，顺逆时针穿插次数决定是否填充。

```
以下是非0环绕原则的原理：（了解即可，非常少会用到复杂的路径）
“非零环绕规则”是这么来判断有自我交叉情况的路径的：对于路径中的任意给定区域，
从该区域内部画一条足够长的线段，使此线段的终点完全落在路径范围之外。

接下来，将计数器初始化为0，
然后，每当这条线段与路径上的直线或曲线相交时，
就改变计数器的值。如果是与路径的顺时针部分相交，则加1，
如果是与路径的逆时针部分相交，则减1。若计数器的最终值不是0，那么此区域就在路径里面，
在调用fill()方法时，浏览器就会对其进行填充。
如果最终值是0，那么此区域就不在路径内部，浏览器也就不会对其进行填充了
```

### 路径开始和闭合

- 开始路径：ctx.beginPath();
- 闭合路径：ctx.closePath();
- 解释：如果复杂路径绘制，必须使用路径开始和结束。闭合路径会自动把最后的线头和开始的线头连在一起。
- beginPath: 核心的作用开启新路径
  每次执行此方法，表示重新绘制一个路径, 后面的绘制跟 beginPath 之前的绘制的路径就无关了。

#### beginPath 注意点:

- canvas 是基于状态的绘图
- 状态：包含当前与当前绘制相关的属性，如：颜色、线宽等
- 新的状态会 “继承” 原先的状态, 虽然旧路径被清除了, 但是状态会保留下来, 线宽, 颜色等还是设置过的状态

## 其他绘制状态（了解即可）

### 绘制线的其他属性

- lineCap 设置线条端点(线头、线冒)样式
  - butt ： 默认。向线条的每个末端添加平直的边缘。
  - round ： 向线条的每个末端添加圆形线帽。
  - square： 向线条的每个末端添加正方形线帽。
  - `<img src="imgs/line-cap.png" height="303" width="480" >`
- lineJoin 设置拐角类型
  - bevel: 创建斜角。
  - round: 创建圆角。
  - miter: 默认。创建尖角
  - `<img src="imgs/line-join.png" height="387" width="453">`
- miterLimit 设置或返回最大斜接长度
  - 斜接长度指的是在两条线交汇处内角和外角之间的距离。
  - 一般用默认值：10 就可以了。除非需要特别长的尖角时，使用此属性。
    `<img src="imgs/line-miterlimit.png" height="410" width="840">`

### 绘制虚线

- 设置： setLineDash(数组)
- 读取： getLineDash()

#### 一些说明

- getLineDash() 与 setLineDash() 方法使用数组描述实线与虚线的长度.

## 绘制矩形

### 快速创建矩形 rect()方法

- 语法：ctx.rect(x, y, width, height);

- 解释：x, y 是矩形左上角坐标， width 和 height 都是以像素计

- rect 方法只是规划了矩形的路径，并没有填充和描边, 所以最后还是要调用 fill 或者 stroke 方法绘制

  ​

### 快速创建描边矩形和填充矩形

- 语法：ctx.strokeRect(x, y, width, height);
  - 注意此方法直接进行 stroke 绘制, 不会产生路径
- 语法：ctx.fillRect(x, y, width, height);

  - 此方法直接进行 fill 填充绘制, 不会产生路径

  ​

### 清除矩形(clearRect)

- 语法：ctx.clearRect(x, y, width, hegiht);

- 解释：清除某个矩形内的绘制的内容，相当于橡皮擦。

  ​

### 清除整个画布

- 1 ctx.clearRect(0, 0, cv.width, cv.height);

- 2 cv.width = cv.width;

## 绘制圆弧

### arc 方法

- 概述：arc() 方法创建弧/曲线（用于创建圆或部分圆）。
- 语法：ctx.arc(x, y, r, sAngle, eAngle, counterclockwise);
- 解释：

  - x,y：圆心坐标。
  - r：半径大小。
  - sAngle:绘制开始的角度。
  - eAngel:结束的角度，注意是弧度。π
  - counterclockwise：是否是逆时针。true 是逆时针，false：顺时针

- `<img src="imgs/arc-angle&radian.gif" />`

### 弧度和角度

- 弧度和角度的转换公式： rad = deg /180 \* Math.PI;

- 在 Math 提供的方法中 **Math.sin、Math.cos 等都使用的单位也是弧度**

  ​

#### 封装角度和弧度的转换函数

```js
function toRadian(angle) {
  return (angle / 180) * Math.PI;
}
function toAngle(radian) {
  return (radian / Math.PI) * 180;
}
```

#### 零度角

- 圆心水平到最右边点是 0 度，顺时针方向弧度（角度为正）增大。

- 练习： 绘制圆弧，圆心在画布中间，从-60 度到 120 度

  ​

### 绘制圆弧和起始点的问题

- 问题说明：

```
如果在绘制圆弧的时候 已经有位置了，那么，这个位置与绘制圆弧的起始点画一条连线！
```

- 解决方式：

  - beginPath

    ​

### 绘制扇形

- 步骤：先 moveTo 到圆心，再绘制圆弧，最后 closePath
- 如果是 fill 填充的扇形图，那么不需要 closePath 就会自动填充

### 计算圆弧上点的坐标

```
计算圆弧上点的坐标的公式:
x = x0 + r * Math.cos(a);
y = y0 + r * Math.sin(a);
```

- sin 在 1 2 象限是正 3 4 象限是负
  - sin 在角度为：0-180 度之间为正，-90-0 度和 180-270 度之间为负
- cos 在 1 4 象限是正 2 3 象限是负
  - cos 在角度为：0-90 度和-90-0 度之间为正，90-270 度之间为负

### 练习

- 练习：动画绘制整个圆
- 练习：绘制饼型图（三等分）
- 练习：绘制普通的饼型图

## 绘制文字

Canvas 除了能绘制基本的形状和文本，还可以实现动画、缩放、各种滤镜和像素转换等高级操作。如果要实现非常复杂的操作，考虑以下优化方案：
通过创建一个不可见的 Canvas 来绘图，然后将最终绘制结果复制到页面的可见 Canvas 中；
尽量使用整数坐标而不是浮点数；
可以创建多个重叠的 Canvas 绘制不同的层，而不是在一个 Canvas 中绘制非常复杂的图；
背景图片如果不变可以直接用&lt;img&gt;标签并放到最底层。

### 常用绘制文字方法

- ctx.fillText() 在画布上绘制“被填充的”文本

  - 参数：文字, x 坐标, y 坐标

- ctx.strokeText() 在画布上绘制文本（无填充）

  ​

### 常用绘制文字属性(了解)

- font 设置或返回文本内容的当前字体属性（与 CSS font 属性相同）

```js
ctx.font = '18px "微软雅黑"';
```

- textAlign 设置或返回文本内容的当前对齐方式
- 记忆: left right center
  - start : 默认。文本在指定的位置开始。
  - end : 文本在指定的位置结束。
  - center: 文本的中心被放置在指定的位置。
  - left : 文本左对齐。
  - right : 文本右对齐。

```js
ctx.textAlign = 'left';
```

对齐图片

- textBaseline 设置或返回在绘制文本时使用的当前文本基线
- 记忆: top middle bottom 默认: alphabetic (基线对齐)
  - alphabetic ： 默认。文本基线是普通的字母基线。
  - top ： 文本基线是 em 方框的顶端。
  - hanging ： 文本基线是悬挂基线。
  - middle ： 文本基线是 em 方框的正中。
  - ideographic： 文本基线是 em 基线。
  - bottom ： 文本基线是 em 方框的底端。

```
例如： ctx.textBaseline = 'top';
```

- [textBaseline 的介绍](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline)

设置文字为主
`<img src="imgs/textBaseline.gif" height="268" width="300" alt="">`

### 练习

- 练习：绘制带有文字的饼型图

  ​

## 绘制图片（drawImage）（重点）

### 绘制图片用法 1 -基本使用

- context.drawImage(img, x, y);
- 参数：

  - img : 图片 dom 对象

  - x,y 绘制图片到画布中坐标

    ​

### 绘制图片用法 2 -设置高度和宽度

- context.drawImage(img, x, y, width, height);
- width：绘制到 canvas 中展示的宽度

```
如果指定宽高，最好成比例，不然图片会被拉伸
等比公式：  height = imgHeight / imgWidth * width;
           设置高 = 原高度 / 原宽度 * 设置宽;
```

### 绘制图片用法 3 -图片裁剪

- context.drawImage(img, imgX, imgY, sWidth, sHeight, x, y, width, height);
- 参数：

  - imgX, imgY：被剪裁图片的起始位置, 图片中的 x,y 坐标

  - sWidth：裁剪宽度 sHeight: 裁剪高度

  - x, y : 要绘制到画布上的位置

  - width ：要绘制到画布上的宽度

  - height：要绘制到画布上的高度

    ​

### 用 JavaScript 创建 img 对象

- 第一种方式：

  - var img = document.createElement("img");

- 第二种方式：

```js
const img = new Image(); //这个就是 img标签的dom对象
img.src = 'imgs/arc.gif';
img.alt = '文本信息';
img.onload = function () {
  //图片加载完成后，执行此方法
};
```

### 绘制图片的步骤

- 1 创建图片对象
- 2 等待图片加载完成
- 3 开始绘制图片

#### 加载图片的问题

- 需要使用 onload 事件 等待图片加载完成之后，再绘制！

  ​

### 练习

- 练习 1: 绘制整个图片

- 练习 2: 绘制图片的一部分

- 练习 3: 绘制序列帧动画

  ​

## 变换 （重点）

### 平移

- ctx.translate(x,y)

- 参数说明：

  - x： 整个坐标轴位移到 原来水平坐标（x）上的值
  - y： 整个坐标轴位移到 原来垂直坐标（y）上的值

- 发生位移后，相当于把画布的 0,0 坐标 更换到新的 x,y 的位置，所有绘制的新元素都被影响。

- 位移画布一般配合缩放和旋转等。

  ​

### 缩放

- scale() 方法缩放当前绘图，更大或更小

- 语法：context.scale(scalewidth,scaleheight)

  - scalewidth : 缩放当前绘图的宽度 (1=100%, 0.5=50%, 2=200%)
  - scaleheight : 缩放当前绘图的高度 (1=100%, 0.5=50%, 2=200%)

- 注意：缩放的是整个画布，缩放后，继续绘制的图形会被放大或缩小。

  ​

### 旋转

- context.rotate(radian); 旋转当前的坐标轴

- 注意参数是弧度（PI）

  ​

### 练习

- 在画布左右两侧分别绘制两个圆

- 绘制两个正方形（宽度：100 和 50）

- 绘制旋转的矩形

  ​

## 环境

前面提到 Canvas 是含有状态的, 也就是说需要修改颜色, 直线样式等, 这些状态都会保留下来

但是有时候, 如果需要回到默认状态中绘制另外的形状, 那么只有再将修改过的样式再更改回来.

如果在该状态中修改的属性较多, 那么每次在回到之前状态时, 就有很多的代码, 就很麻烦

```
Canvas 中引入了状态的保持机制.
使用 CanvasRenderingContext2D.save() 方法可以保存当前状态.
如果需要恢复到已经保存的状态, 只需要调用 CanvasRenderingContext2D.restore() 方法即可.

状态保持的机制是基于状态栈实现的. 也就是说 save 一次就存储一个状态.
restore 一次就将刚刚存入的恢复. 如果 save 两次, 就需要 restore 两次, 才可以恢复到最先的状态.

一般在封装绘图的时候都会采用开始绘制之前, save 一次, 然后 开启一个新路径 beginPath,
然后绘制结束后 restore, 这样保持当前状态不会对其他绘图代码构成影响.
```

### 绘制环境保存和还原

- ctx.save() 保存当前环境的状态

- ctx.restore() 返回之前保存过的路径状态和属性

### 画布保存 base64 编码内容(了解)

- 把 canvas 绘制的内容 输出成 base64 内容。
- 语法：canvas.toDataURL(type, encoderOptions);
- 例如：canvas.toDataURL("image/png",1);
- 参数：
  - type，设置输出的类型，比如 image/png image/jpeg 等
  - encoderOptions： 0-1 之间的数字，用于标识输出图片的质量，1 表示无损压缩(可选)

```js
const canvas = document.getElementById('canvas');
const dataURL = canvas.toDataURL();
console.log(dataURL);
// "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNby
// blAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC"

const img = document.querySelector('#img-demo'); //拿到图片的dom对象
img.src = canvas.toDataURL('image/png'); //将画布的内容给图片标签显示
```

## 作用

### 图片的浏览器兼容检测

```js
function checkWebp() {
  try {
    return (
      document
        .createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') == 0
    );
  } catch {
    return false;
  }
}

console.log(checkWebp()); // true or false
```

## 参考

- [案例+图解带你一文读懂 Canvas](https://juejin.cn/post/7119495608938790942)
- [Canvas 从入门到劝朋友放弃](https://juejin.cn/post/7116784455561248775)
