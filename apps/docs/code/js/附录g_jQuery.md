# 第 8 章\_jQuery

jQuery 是 JavaScript 世界中使用最广泛的一个库。它的作用：

- 消除浏览器差异：你不需要自己写冗长的代码来针对不同的浏览器来绑定事件,编写 AJAX 等代码；
- 简洁的操作 DOM 的方法：写$('#test')肯定比'document.getElementById('test')'来得简洁；
- 轻松实现动画、修改 CSS 等各种操作。

## 简介

使用 jQuery 只需要在页面引入 jQuery 文件即可

### 入口函数

jQuery 的入口函数不会发生覆盖：

```js
//第一种写法
$(document).ready(() => {});

//第二种写法
$(() => {});
```

对比 JavaScript 的入口函数 jQuery 的入口函数,执行时机：

1. JavaScript 的入口函数要等到页面中所有资源（包括图片、文件）加载完成才开始执行。
2. jQuery 的入口函数只会等待文档树加载完成就开始执行,并不会等待图片、文件的加载。

|                  | 原生 JS                                                | jquery                                               |
| ---------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| **入口函数**     | 只能有一个，如果有多个，后面的会覆盖前面               | 可以有多个，并且不会发生覆盖的情况                   |
| **代码容错性**   | 代码容错性差，代码出现错误，会影响到后面代码的运行。   | 代码容错性好，屏蔽错误，并且不会影响后面代码的运行。 |
| **浏览器兼容性** | 兼容性差，比如火狐不支持 innerText                     | 对浏览器兼容性做了封装，因此不存在兼容性问题         |
| **操作复杂性**   | DOM 操作复杂，对于一些简单的动画效果，实现起来比较麻烦 | DOM 操作简单，支持隐式迭代，实现动画非常简单。       |

### **jQuery 对象**

- 什么是 DOM 对象（js 对象）？
  - 使用 JavaScript 中的方法获取页面中的元素返回的对象就是 dom 对象。_dom 对象只可以使用 dom 对象的方法和属性_,jQuery 的选择器不会返回 undefined 或者 null
- 什么是 jquery 对象？
  - jquery 对象就是使用 jquery 的方法获取页面中的元素返回的对象就是 jQuery 对象。_jquery 对象只能使用 jquery 对象的方法_

注：_jQuery 是伪数组，可以遍历_

`$` 是著名的 jQuery 符号。实际上,jQuery 把所有功能全部封装在一个全局变量 jQuery 中,而`$`也是一个合法的变量名,它是变量 jQuery 的别名：

```js
window.jQuery; // jQuery(selector, context)
window.$; // jQuery(selector, context)
$ === jQuery; // true
typeof $; // 'function'
```

`$`本质上就是一个函数,但是函数也是对象,于是$除了可以直接调用外,也可以有很多其他属性。

jQuery 对象其实就是 DOM 对象的包装集（包装了 DOM 对象的集合（伪数组））

jQuey 对象转 DOM 对象：

- 直接[下标]
- jQuey 的 `.get(下标)` 方法

DOM 对象转 jquery 对象：直接使用 $() 封装即可

注意,你看到的 `$` 函数名可能不是 jQuery(selector, context),因为很多 JavaScript 压缩工具可以对函数名和参数改名,所以压缩过的 jQuery 源码 `$` 函数可能变成 a(b, c)。

绝大多数时候,我们都直接用 `$` 。但是,如果 `$` 这个变量不幸地被占用了,而且还不能改,那我们就只能让 jQuery 把 `$` 变量交出来,然后就只能使用 jQuery 这个变量：

```js
$; // jQuery(selector, context)
jQuery.noConflict();
$; // undefined
jQuery; // jQuery(selector, context)
```

这种方法的原理是 jQuery 在占用 `$` 之前,先在内部保存了原来的 `$`,调用 jQuery.noConflict()时会把原来保存的变量还原。

## 选择器

jQuery 选择器返回的是 jQuery 对象。

jQuery 选择器有很多,基本兼容了 CSS1 到 CSS3 所有的选择器,并且 jQuery 还添加了很多更加复杂的选择器。

### 遍历

- `parent()`：返回被选元素的直接父元素。
- `parents()`：返回被选元素的所有父元素。
- `parentsUntil()`：返回介于两个给定元素之间的所有祖先元素`$("span").parentsUntil("div");`返回介于 `<span>` 与 `<div>` 元素之间的所有 `<span>` 的祖先元素
- `children()`：返回被选元素的所有直接子元素
- `find()`：返回被选元素的后代元素,一路向下直到最后一个后代。`$("div").find("span");`返回属于 `<div>` 后代的所有 `<span>` 元素
- `siblings()`：返回被选元素的所有同胞元素
- `next()`：返回被选元素的下一个同胞元素
- `nextAll()`：返回被选元素的所有跟随的同胞元素
- `nextUntil()`：返回介于两个给定参数之间的所有跟随的同胞元素
- `prev()`：返回被选元素的上一个同胞元素
- `prevAll()`：返回被选元素的所有上方的同胞元素
- `prevUntil()`：返回介于两个给定参数之间的所有上方的同胞元素

### 过滤

过滤器一般不单独使用,它通常附加在选择器上,帮助我们更精确地定位元素

- `first()`：返回被选元素的首个元素
- `last()`：返回被选元素的最后一个元素
- `eq()`：返回被选元素中带有指定索引号的元素
- `filter()`：返回匹配标准的所有元素
- `·not()`：返回不匹配标准的所有元素
- `:eq(index)`：索引
- `:odd`：奇数元素
- `:even`：偶数元素

- `:last-child`、`:nth-child(even)` 等

> 注意：选出来的元素是按照它们在 HTML 中出现的顺序排列的,且不会有重复元素

### 表单相关

针对表单元素,jQuery 还有一组特殊的选择器：

- `:input`：可以选择`<input>`,`<textarea>`;,`<select>`和`<button>`（即所有的表单元素）；
- `:file`：可以选择`<input type="file">`,和 input[type=file]一样；
- `:checkbox`：可以选择复选框,和 input[type=checkbox]一样；
- `:radio`：可以选择单选框,和 input[type=radio]一样；
- `:focus`：可以选择当前输入焦点的元素,例如把光标放到一个`<input>`上,用$('input:focus')就可以选出；
- `:checked`：选择当前勾上的单选框和复选框,用这个选择器可以立刻获得用户选择的项目,如$('input[type=radio]:checked')；
- `:enabled`：可以选择可以正常输入的`<input>`、`<select>`等,也就是没有灰掉的输入；
- `:disabled`：和:enabled 正好相反,选择那些不能输入的。
- 此外,jQuery 还有很多有用的选择器,例如,选出可见的或隐藏的元素

```js
$('div:visible'); // 所有可见的div
$('div:hidden'); // 所有隐藏的div
```

### 过滤选择器

:eq(index) $("li:eq(2)").css("color", "red"); 获取到的 li 元素中，选择索引号为 2 的元素，索引号 index 从 0 开始。
:odd $("li:odd").css("color", "red"); 获取到的 li 元素中，选择索引号为奇数的元素
:even $("li:even").css("color", "red"); 获取到的 li 元素中，选择索引号为偶数的元素

## 属性操作

### css 操作

功能：设置或者修改样式,操作的是 style 属性

- 功能：设置或者修改样式,操作的是 style 属性
  css(name, value); // name：样式名称,value：样式值
- 设置多个样式
  css(obj)；//参数可为多种形式，有兼容性
- 获取样式
  css(name); // 注意：获取样式操作只会返回第一个元素对应的样式值

隐式迭代：

1. 设置操作的时候,如果是多个元素,那么给所有的元素设置相同的值
2. 获取操作的时候,如果是多个元素,那么只会返回第一个元素的值

### class 操作

添加、移除、切换样式类：

- addClass("name");
- removeClass("name"); //不传参清除所有 class
- toggleClass("name");
- hasClass("name"); //返回 boolean，判断是否拥有该类名

### attr 属性

- 操作属性：attr(name, value); // name：属性名称,value：样式值
- 操作多个属性：attr(obj);
- 获取属性：attr(name);// 如有多个同名的 dom,只返回第一个的 value。
- 设置和获取自定义属性

也可同时设置多个属性值
移除属性：removeAttr(name); // 参数：需要移除的属性名,如果传空,那么不会有任何操作,注意,并不是移除所有的属性。区分 removeClass

### val 表单的值

val()获取的是动态更新的值，而 attr("value")获取的设定的初始值

### prop 操作

在 jQuery1.6 之后,对于 checked、selected、disabled 这类 boolean 类型的属性来说,不能用 attr 方法,只能用 prop 方法

```js
//设置属性
$(':checked').prop('checked', true);

//获取属性
$(':checked').prop('checked'); //返回true或者false
```

prop() 返回值更合理一些。不过,用 is()方法判断更好：

```js
const radio = $('#test-radio');
radio.is(':checked'); // true
```

### 修改 Text、HTML 和 input

- html() 方法:该方法会识别 html 标签
- text() 方法:会将内容直接当成字符串,并不会识别 html 标签
- val() 方法 val 方法用于设置和获取表单元素的值

checkbox 的改变最好使用 change 事件（tab 键切换，空格键改变 checked）

## map() 和 each()

$.map(arr,function(element,index){

})

$.each(arr,function(index,element){

})

map()方法主要用来遍历操作数组和对象，each()主要用于遍历 jquery 对象。

两者回调函数的参数不一样

each()返回的是原来的数组，并不会新创建一个数组。
map()方法会返回一个新的数组。

## 动画

### 显示与隐藏

hide() 、show()、toggle()

show([speed], [callback])：速度和回调函数

- speed(可选)：动画的执行时间
  1. 如果不传,就没有动画效果。
  2. 毫秒值(比如 1000),动画在 1000 毫秒执行完成(**推荐**)
  3. 固定字符串,slow(200)、normal(400)、fast(600),如果传其他字符串,则默认为 normal。
- callback(可选):执行完动画后执行的回调函数

hide 与 show 方法的用法完全一致。

show/hide：修改的是元素的 width、height、opacity。

注：**如果调用 show()的 DOM 对象没有设置宽高，那么元素会突然出现，忽略括号内的时间参数。**

### 滑入与滑出

滑入(slideUp)与滑出(slideDown)是一组动画,效果与卷帘门类似

fadeIn()、fadeOut()、fadeToggle()、fadeTo()

slideUp(speed, callback);

- speed(可选)：动画的执行时间
  1. 如果不传,默认为 normal,注意区分 show/hide。
  2. 毫秒值(比如 1000),动画在 1000 毫秒执行完成(**推荐**)
  3. 固定字符串,slow(200)、normal(400)、fast(600)
- callback(可选):执行完动画后执行的回调函数

修改的是元素的 height

### 淡入淡出

- `fadeIn()`：$(selector).fadeIn(speed,callback);淡入
  speed:可选,规定效果的时常。可取： "slow","fast",毫秒值
  callback：可选,fadeIn 完成后执行的函数名称

- `fadeOutdddd`：$(selector).fadeOut(speed,callback);淡出
  speed:可选,规定效果的时常。可取： "slow","fast",毫秒值
  callback：可选,fadeIn 完成后执行的函数名称

- `fadeToggle()`：$(selector).fadeToggle(speed,callback);淡入、淡出间进行切换
  speed:可选,规定效果的时常。可取： "slow","fast",毫秒值
  callback：可选,fadeIn 完成后执行的函数名称

- `fadeTo()`：$(selector).fadeTo(speed,opacity,callback);渐变为给定的不透明度（值介于 0 与 1 之间）
  speed:必需,规定效果的时常。可取： "slow","fast",毫秒值
  opacity:必需,规定不透明度
  callback：可选,fadeIn 完成后执行的函数名称

修改的是元素的 opacity

### 自定义动画

animate：自定义动画

```js
$(selector).animate({ params }, speed, easing, callback);
```

- params：必需的,参数定义形成动画的 CSS 属性
- speed：可选的,参数规定效果的时长。它可以取以下值："slow"、"fast" 或毫秒
- easing：可选的,控制动画在不同元素的速度,默认为"swing"
  - "swing"：在开头和结尾移动慢,在中间移动速度快
  - "linear"：匀速移动
- callback：可选的,参数是动画完成后所执行的函数名称

注：_默认情况下,所有 HTML 元素都有一个静态位置,且无法移动。
如需对位置进行操作,要记得首先把元素的 CSS position 属性设置为 relative、fixed 或 absolute！_

注：使用 animate() 时,必须使用 Camel 标记法书写所有的属性名,比如,必须使用 paddingLeft 而不是 padding-left,使用 marginRight 而不是 margin-right,色彩动画并不包含在核心 jQuery 库中。

### stop

在同一个元素上执行多个动画，那么对于这个动画来说，后面的动画会被放到动画队列中，等前面的动画执行完成了才会执行

因此，为了防止动画队列对效果的影响，每开启动画队列前，需要先停止上一个动画队列。

`stop()` 方法用来在动画或效果完成前对它们进行停止。

语法：$(selector).stop(stopAll,goToEnd);

- stopAll：可选。规定是否应该清除动画队列。默认是 false,即仅停止活动的动画,允许任何排入队列的动画向后执行。**true 清空动画队列**
- goToEnd：可选。规定是否立即完成当前动画。默认是 false。

因此,默认地,stop() 会清除在被选元素上指定的当前动画。

### delay()

传入毫秒，常用于动画队列，延迟动画队列

## DOM 操作

### 新建元素

`var $span = $("<span>这是一个span元素</span>");`

### 添加元素

- `append()` - 在被选元素的结尾插入内容。对应 `appendTo()`
- `prepend()` - 在被选元素的开头插入内容。对应 `prependTo()`
- `after()`- 在被选元素之后插入内容
- `before()` - 在被选元素之前插入内容

### 删除元素

- remove() - 删除被选元素（及其子元素）
  `remove()` 方法也可接受一个参数,允许您对被删元素进行过滤。
  下面的例子删除 class="italic" 的所有 `<p>` 元素：

  ```js
  $('p').remove('.italic');
  ```

- empty() - 从被选元素中删除子元素
  `empty()` 无法过滤

### 操作 DOM

#### `width()` 和 `height()`

- `width()`：返回元素的宽度（不包括内边距、边框或外边距）
- `height()`：返回元素的高度（不包括内边距、边框或外边距）
- `innerWidth()`：返回元素的宽度（包括内边距）
- `innerHeight()`：返回元素的高度（包括内边距）
- `outerWidth()`：元素的宽度（包括内边距和边框）
- `outerHeight()`：元素的高度（包括内边距和边框）
- `outerWidth(true)`： 方法返回元素的宽度（包括内边距、边框和外边距）
- `outerHeight(true)`： 方法返回元素的高度（包括内边距、边框和外边距）

利用 jQuery 对象的若干方法,我们直接可以获取 DOM 的高宽等信息,而无需针对不同浏览器编写特定代码：

```js
// 浏览器可视窗口大小:
$(window).width(); // 800
$(window).height(); // 600

// HTML文档大小:
$(document).width(); // 800
$(document).height(); // 3500

// 某个div的大小:
const div = $('#test-div');
div.width(); // 600
div.height(); // 300
div.width(400); // 设置CSS属性 width: 400px,是否生效要看CSS是否有效
div.height('200px'); // 设置CSS属性 height: 200px,是否生效要看CSS是否有效
```

#### `scrollTop`

设置或者获取垂直滚动条的位置`$(selector).scrollTop();`

设置或者获取水平滚动条的位置`$(selector).scrollLeft();`

#### 获取 left，top 的值

```
var left = $('#test').position().left;
var top = $('#test').position().top;
```

## 表单序列化 serialize

jquery 提供了一个`serialize()`方法序列化表单，说白就是将表单中带有 name 属性的所有参数拼成一个格式为`name=value&name1=value1`这样的字符串。方便我们获取表单的数据。

```js
//serialize将表单参数序列化成一个字符串。必须指定name属性
//name=hucc&pass=123456&repass=123456&mobile=18511249258&code=1234
$('form').serialize();
```

jquery 的 ajax 方法，data 参数能够直接识别表单序列化的数据

```js
$.post({
  url: 'register.php',
  data: $('form').serialize(),
  dataType: 'json',
  success(info) {
    console.log(info);
  },
});
```

### toArray()

将 jquery 对象的伪数组集合转换为数组

实用：在表格的 checkbox 集合的级联操作中，可以在进入页面时保存已经选择的 checkbox，转换成数组后再使用数组的方法获得对应 id 传入判定的数组中

## 事件

### 事件绑定

1. 简单事件绑定:click(handler); // click(handler)
2. bind('event',fn); // 不支持动态创建出来的元素绑定事件.
   - $(selector).unbind(); //解绑所有的事件
   - $(selector).unbind(“click”); //解绑指定的事件
3. delegate('element', 'event',fn); // 为什么 delegate 支持动态绑定事件？原因是事件冒泡机制。因为事件绑定到父元素上的,由子元素触发
   - $( selector ).undelegate(); //解绑所有的 delegate 事件
   - $( selector).undelegate( “click” ); //解绑所有的 click 事件
4. on('event', 'element',fn):jQuery1.7 之后,jQuery 用 on 统一了所有事件的处理方法
   - $(selector).off();// 解绑匹配元素的所有事件
   - $(selector).off(“click”);解绑匹配元素的所有 click 事件
   - $(selector).off( “click”, “\*\*” ); 解绑所有代理的 click 事件，元素本身的事件不会被解绑。这个选择器是父级元素

on 事件绑定:

优势：最现代的方式,兼容 zepto(移动端类似 jQuery 的一个库),强烈建议使用。

// 第一个参数：events,String 类型一个或多个用空格分隔的事件类型和可选的命名空间（标准事件或者自定义事件）

// 第二个参数：childSelector,一个 jQuery 选择器，用于指定哪些后代元素可以触发绑定的事件。如果该参数为`null`或被省略，则表示当前元素自身绑定事件(实际触发者也可能是后代元素，只要事件流能到达当前元素即可)。

// 第三个参数：data,规定传递到函数的额外数据,事件触发的时候通过 event.data 来使用（不常使用）

// 第四个参数：function,事件处理函数
$(selector).on(events,childSelector,data,function);

多个事件绑定不同事件时，可以写成对象形式：

```js
$('p').on({
  mouseover() {
    $('body').css('background-color', 'lightgray');
  },
  mouseout() {
    $('body').css('background-color', 'lightblue');
  },
  click() {
    $('body').css('background-color', 'yellow');
  },
});
```

> 注：如果传递了`selector`参数，那么`on()`函数并不是为当前 jQuery 对象匹配的元素绑定事件处理函数，而是为它们的后代元素中符合选择器`selector`参数的元素绑定事件处理函数。`on()`函数并不是直接为这些后代元素挨个绑定事件，而是委托给当前 jQuery 对象的匹配元素来处理。由于 DOM 2 级的事件流机制，当后代元素`selector`触发事件时，该事件会在事件冒泡中传递给其所有的祖辈元素，当事件流传递到当前匹配元素时，jQuery 会判断是哪个后代元素触发了事件，如果该元素符合选择器`selector`，jQuery 就会捕获该事件，从而执行绑定的事件处理函数。通俗易懂地说，如果我们希望给页面上所有的`<p>`标签绑定 click 事件处理函数，我们可以在每个 p 标签上直接分别绑定 click 事件处理函数。

注意：**"focus"、"blur"等部分事件不支持冒泡，使用事件委托机制将无效。不过，他们一般也有对应的支持冒泡的事件。例如与"focus"对应的"focusin"，与"blur"对应的"focusout"。此外，我们也可以使用 event.stopPropagation()让当前触发的事件停止冒泡。**

### 事件绑定注意

.delegate 和 .on 的区别：

delegate 在底层就是用 on 封装的，只是参数改变了一下位置

```js
jQuery.fn.extend({
  bind(types, data, fn) {
    return this.on(types, null, data, fn);
  },
  unbind(types, fn) {
    return this.off(types, null, fn);
  },
  delegate(selector, types, data, fn) {
    return this.on(types, selector, data, fn);
  },
  undelegate(selector, types, fn) {
    // ( namespace ) or ( selector, types [, fn] )
    return arguments.length === 1
      ? this.off(selector, '**')
      : this.off(types, selector || '**', fn);
  },
});
```

而 . on 则是：

```js
return elem.each(function () {
  jQuery.event.add(this, types, fn, data, selector);
});
```

### 鼠标事件

- click: 鼠标单击时触发； dblclick：鼠标双击时触发；
- mouseenter：鼠标进入时触发； mouseleave：鼠标移出时触发；
- mouseover：鼠标进入时触发； mouseout：鼠标移出时触发；
- mousemove：鼠标在 DOM 内部移动时触发；
- hover：鼠标进入和退出时触发两个函数,相当于 mouseenter 加上 mouseleave。

mouseover 和 mouseenter 的区别：mouseover 移到盒子范围内的其他元素也会触发,而 mouseenter 不会触发（不受冒泡的影响）

### 键盘事件

键盘事件仅作用在当前焦点的 DOM 上,通常是`<input>`和`<textarea>`。

- keydown：键盘按下时触发；
- keyup：键盘松开时触发；
- keypress：按一次键后触发。

#### e.which 获取键盘码

```js
$(element).on('keyup', (event) => {
  if (event.which === 13) {
    // 如果弹起的是回车键，则...
  }
});
```

### 其他事件

focus：当 DOM 获得焦点时触发；
blur：当 DOM 失去焦点时触发；
change：当`<input>`、`<select>`;或`<textarea>`的内容改变时触发；
submit：当`<form>`提交时触发； ready：当页面被载入并且 DOM 树完成初始化后触发。

### 取消绑定

一个已被绑定的事件可以解除绑定,通过 off('click', function)实现：

// 解绑匹配元素的所有事件
$(selector).off();

// 解绑匹配元素的所有 click 事件
$(selector).off('click');

// 解绑所有代理的 click 事件,元素本身的事件不会被解绑
这个选择器是父级元素
$(selector).off('click','\*\*');

```js
function hello() {
  alert('hello!');
}

a.click(hello); // 绑定事件

// 10秒钟后解除绑定:
setTimeout(() => {
  a.off('click', hello);
}, 10000);
```

### one()方法

one() 方法为被选元素附加一个或多个事件处理程序，并规定当事件发生时运行的函数。

当使用 one() 方法时，每个元素只能运行一次事件处理器函数。

```js
$('p').one('click', function () {
  $(this).animate({ fontSize: '+=6px' });
});
```

## 事件触发

简单事件触发
$(selector).click(); //触发 click 事件

trigger 方法触发事件
$(selector).trigger("click");

## 阻止浏览器默认事件

```js
$('a').click((event) => {
  event.preventDefault();
});
```

## jQuery 事件对象

| **对象属性**            | **解释**                                           |
| ----------------------- | -------------------------------------------------- |
| event.type              | 事件类型                                           |
| event.data              | 存储绑定事件时传递的附加数据                       |
| event.target            | 点了谁就是谁                                       |
| event.currentTarget     | 等同于 this,将来调用这个事件的对象                 |
| event.delegateTarget    | 代理对象                                           |
| screenX 和 screenY      | 对应屏幕最左上角的值                               |
| offsetX 和 offsetY      | 点击的位置距离元素的左上角的位置                   |
| clientX 和 clientY      | 距离页面左上角的位置（忽视滚动条）                 |
| pageX 和 pageY          | 距离页面最顶部的左上角的位置（会计算滚动条的距离） |
| event.witch             | 鼠标按键类型,1=鼠标左键 2=鼠标中键 3=鼠标右键      |
| event.keyCode           | 按下的键盘代码                                     |
| event.stopPropagation() | 阻止事件冒泡行为                                   |
| event.preventDefault()  | 阻止浏览器默认行为                                 |
| return false;           | 既阻止冒泡,又阻止了默认行为                        |

## 插件

### 制作插件

jQuery 对象扩展方法

$.fn. pluginName = function() {};

## AJAX

jQuery AJAX 方法
AJAX 是一种与服务器交换数据的技术,可以在不重新载入整个页面的情况下更新网页的一部分。
下面的表格列出了所有的 jQuery AJAX 方法：

- $.ajax() 执行异步 AJAX 请求
  - $.ajaxPrefilter()在每个请求发送之前且被 $.ajax() 处理之前,处理自定义 Ajax 选项或修改已存在选项
  - $.ajaxSetup()为将来的 AJAX 请求设置默认值
  - $.ajaxTransport()创建处理 Ajax 数据实际传送的对象
  - $.get()使用 AJAX 的 HTTP GET 请求从服务器加载数据
  - $.getJSON()使用 HTTP GET 请求从服务器加载 JSON 编码的数据
  - $.getScript()使用 AJAX 的 HTTP GET 请求从服务器加载并执行 JavaScript
  - $.param()创建数组或对象的序列化表示形式（可用于 AJAX 请求的 URL 查询字符串）
  - $.post()使用 AJAX 的 HTTP POST 请求从服务器加载数据
  - ajaxComplete()规定 AJAX 请求完成时运行的函数
  - ajaxError()规定 AJAX 请求失败时运行的函数
  - ajaxSend()规定 AJAX 请求发送之前运行的函数
  - ajaxStart()规定第一个 AJAX 请求开始时运行的函数
  - ajaxStop()规定所有的 AJAX 请求完成时运行的函数
  - ajaxSuccess()规定 AJAX 请求成功完成时运行的函数
  - load()从服务器加载数据,并把返回的数据放置到指定的元素中
  - serialize()编码表单元素集为字符串以便提交
  - serializeArray()编码表单元素集为 names 和 values 的数组

## jQuery 杂项方法

- data() 向被选元素附加数据,或者从被选元素获取数据
  - each()为每个匹配元素执行函数
  - get()获取由选择器指定的 DOM 元素
  - index()从匹配元素中搜索给定元素
  - $.noConflict()释放变量 $ 的 jQuery 控制权
  - $.param()创建数组或对象的序列化表示形式（可在生成 AJAX 请求时用于 URL 查询字符串中）
  - removeData()移除之前存放的数据
  - size()在版本 1.8 中被废弃。返回被 jQuery 选择器匹配的 DOM 元素的数量
  - toArray()以数组的形式检索所有包含在 jQuery 集合中的所有 DOM 元素
  - pushStack()将一个 DOM 元素集合加入到 jQuery 栈
  - $.when()提供一种方法来执行一个或多个对象的回调函数

## jQuery 实用工具

$.boxModel 在版本 1.8 中被废弃。检测浏览器是否使用W3C的CSS盒模型渲染当前页面
$.browser 在版本 1.9 中被废弃。返回用户当前使用的浏览器的相关信息
$.contains() 判断另一个DOM元素是否是指定DOM元素的后代
$.each() 遍历指定的对象和数组
$.extend() 将一个或多个对象的内容合并到目标对象
$.fn.extend() 为 jQuery 扩展一个或多个实例属性和方法
$.globalEval() 全局性地执行一段JavaScript代码
$.grep() 过滤并返回满足指定函数的数组元素
$.inArray() 在数组中查找指定值并返回它的索引值（如果没有找到,则返回-1）
$.isArray() 判断指定参数是否是一个数组
$.isEmptyObject() 检查对象是否为空（不包含任何属性）
$.isFunction() 判断指定参数是否是一个函数
$.isNumeric() 判断指定参数是否是一个数字值
$.isPlainObject() 判断指定参数是否是一个纯粹的对象
$.isWindow() 判断指定参数是否是一个窗口
$.isXMLDoc() 判断一个 DOM 节点是否位于 XML 文档中,或者其本身就是 XML 文档
$.makeArray() 将一个类似数组的对象转换为真正的数组对象
$.map() 指定函数处理数组中的每个元素(或对象的每个属性),并将处理结果封装为新的数组返回
$.merge() 合并两个数组内容到第一个数组
$.noop() 一个空函数
$.now() 返回当前时间
$.parseHTML() 将 HTML 字符串解析为对应的 DOM 节点数组
$.parseJSON() 将符合标准格式的JSON字符串转为与之对应的JavaScript对象
$.parseXML() 将字符串解析为对应的 XML 文档
$.trim() 去除字符串两端的空白字符
$.type() 确定 JavaScript 内置对象的类型
$.unique() 在jQuery 3.0中被弃用。对DOM元素数组进行排序,并移除重复的元素
$.uniqueSort() 对 DOM 元素数组进行排序,并移除重复的元素
$.data() 在指定的元素上存取数据,并返回设置值
$.hasData() 确定一个元素是否有相关的 jQuery 数据
$.sub() 创建一个新的jQuery副本,其属性和方法可以修改,而不会影响原来的jQuery对象
$.speed 创建一个包含一组属性的对象用来定义自定义动画
$.htmlPrefilter() 通过jQuery操作方法修改和过滤HTML字符串
$.readyException() 处理包裹在 jQuery()中函数同步抛出的错误

## jQuery 回调对象

$.Callbacks() 一个多用途的回调列表对象,用来管理回调函数列表
callbacks.add() 在回调列表中添加一个回调或回调的集合
callbacks.disable() 禁用回调列表中的回调函数
callbacks.disabled() 确定回调列表是否已被禁用
callbacks.empty() 从列表中清空所有的回调
callbacks.fire() 传入指定的参数调用所有的回调
callbacks.fired() 确定回调是否至少已经调用一次
callbacks.firewith() 给定的上下文和参数访问列表中的所有回调
callbacks.has() 判断回调列表中是否添加过某回调函数
callbacks.lock() 锁定当前状态的回调列表
callbacks.locked() 判断回调列表是否被锁定
callbacks.remove() 从回调列表中的删除一个回调或回调集合

## jQuery 延迟对象

在 jQuery 1.5 中介绍了 Deferred 延迟对象,它是通过调用 jQuery.Deferred() 方法来创建的可链接的实用对象。它可注册多个回调函数到回调列表,调用回调列表并且传递异步或同步功能的成功或失败的状态。
延迟对象是可链接的,类似于一个 jQuery 对象可链接的方式,区别于它有自己的方法。在创建一个 Deferred 对象之后,您可以使用以下任何方法,直接链接到通过调用一个或多个的方法创建或保存的对象。

$.Deferred() 返回一个链式实用对象方法来注册多个回调
deferred.always() 当 Deferred（延迟）对象被受理或被拒绝时,调用添加的处理程序
deferred.done() 当 Deferred（延迟）对象被受理时,调用添加的处理程序
deferred.fail() 当 Deferred（延迟）对象被拒绝时,调用添加的处理程序
deferred.isRejected() 从 jQuery1.7 开始已经过时,确定 Deferred 对象是否已被拒绝
deferred.isResolved() 从 jQuery1.7 开始已经过时,确定 Deferred 对象是否已被解决
deferred.notify() 给定一个参数,调用正在延迟对象上进行的回调函数( progressCallbacks )
deferred.notifyWith() 给定上下文和参数,调用正在延迟对象上进行的回调函数( progressCallbacks )
deferred.pipe() 过滤 and/or 链式延迟对象的工具方法
deferred.progress() 当 Deferred（延迟）对象生成进度通知时,调用添加处理程序
deferred.promise() 返回 Deferred(延迟)的 Promise 对象
deferred.reject() 拒绝 Deferred（延迟）对象,并根据给定的参数调用任何 failCallbacks 回调函数
deferred.rejectWith() 拒绝 Deferred（延迟）对象,并根据给定的 context 和 args 参数调用任何 failCallbacks 回调函数
deferred.resolve() 解决 Deferred（延迟）对象,并根据给定的参数调用任何 doneCallbacks 回调函数
deferred.resolveWith() 解决 Deferred（延迟）对象,并根据给定的 context 和 args 参数调用任何 doneCallbacks 回调函数
deferred.state() 确定一个 Deferred（延迟）对象的当前状态
deferred.then() 当 Deferred（延迟）对象解决,拒绝或仍在进行中时,调用添加处理程序
.promise() 返回一个 Promise 对象,观察某种类型被绑定到集合的所有行动,是否已被加入到队列中

## jQuery 属性

- context 在版本 1.10 中被废弃。包含被传递到 jQuery 的原始上下文
  - jquery 包含 jQuery 的版本号
  - jQuery.fx.interval 改变以毫秒计的动画运行速率
  - jQuery.fx.off 对所有动画进行全局禁用或启用
  - jQuery.support 包含表示不同浏览器特性或漏洞的属性集（主要用于 jQuery 的内部使用）
  - length 包含 jQuery 对象中元素的数目
  - jQuery.cssNumber 包含所有可以不使用单位的 CSS 属性的对象

## jQuery 的框架封装
