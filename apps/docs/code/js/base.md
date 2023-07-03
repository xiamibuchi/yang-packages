---
title: JavaScript 基础
editLink: true
---

# JavaScript 基础

js 由三部分组成

- ECMAScript: 提供核心语言功能，就是对实现该标准规定的各个方面内容的语言的描述
- DOM(Document Object Model): 呈现以及与任意 HTML 或 XML 交互的 API 文档。DOM 是载入到浏览器中的文档模型，它用节点树的形式来表现文档，每个节点代表文档的构成部分
- BOM（Browser Object Model）: 描述了和浏览器交互的方法和接口

## 内存管理

JavaScript 是在创建变量（对象，字符串等）时自动进行了分配内存，并且在不使用它们时“自动”释放。释放的过程称为垃圾回收。

### 垃圾回收

引用计数：

1. 一个对象如果有访问另一个对象的权限，佳作一个对象引用另一个对象
2. 无法处理循环引用的事例。在下面的例子中，两个对象被创建，并互相引用，形成了一个循环。它们被调用之后会离开函数作用域，所以它们已经没有用了，可以被回收了。然而，引用计数算法考虑到它们互相都有至少一次引用，所以它们不会被回收。

```js
function f() {
  const o = {};
  const o2 = {};
  o.a = o2; // o 引用 o2
  o2.a = o; // o2 引用 o

  return 'azerty';
}

f();
```

mark-and-sweep（标记清除）：

当变量进入环境（例如，在函数中声明一个变量）时，就将这个变量标记为“进入环境”。从逻辑上讲，永远不能释放进入环境的变量所占的内存，因为只要执行流进入相应的环境，就可能用到它们。而当变量离开环境时，这将其 标记为“离开环境”。

### V8 的垃圾回收机制

V8 将堆中的对象分为两类：

新生代：年轻的新对象，未经历垃圾回收或仅经历过一次
老年代：存活时间长的老对象，经历过一次或更多次垃圾回收的对象

默认情况下，V8 为老年代分配的空间，大概是新生代的 40 多倍。
新对象都会被分配到新生代中，当新生代空间不足以分配新对象时，将触发新生代的垃圾回收。

新生代的垃圾回收
新生代中的对象主要通过 Scavenge 算法进行垃圾回收，这是一种采用复制的方式实现内存回收的算法。
Scavenge 算法将新生代的总空间一分为二，只使用其中一个，另一个处于闲置，等待垃圾回收时使用。使用中的那块空间称为 From，闲置的空间称为 To。From 与 To 各占一半，当新生代触发垃圾回收时，V8 将 From 空间中所有应该存活下来的对象依次复制到 To 空间。

有两种情况不会将对象复制到 To 空间，而是晋升至老年代：

对象此前已经经历过一次新生代垃圾回收，这次依旧应该存活，则晋升至老年代。
To 空间已经使用了 25%，则将此对象直接晋升至老年代。

From 空间所有应该存活的对象都复制完成后，原本的 From 空间将被释放，成为闲置空间，原本 To 空间则成为使用中空间，两个空间进行角色翻转。
为何 To 空间使用超过 25%时，就需要直接将对象复制到老年代呢？因为 To 空间完成垃圾回收后将会翻转为 From 空间，新的对象分配都在此处进行，如果没有足够的空闲空间，将会影响程序的新对象分配。
因为 Scavenge 只复制活着的对象，而根据统计学指导，新生代中大多数对象寿命都不长，长期存活对象少，则需要复制的对象相对来说很少，因此总体来说，新生代使用 Scavenge 算法的效率非常高。且由于 Scavenge 是依次连续复制，所以 To 空间永远不会存在内存碎片。
不过由于 Scavenge 会将空间对半划分，所以此算法的空间利用率较低。

老年代的垃圾回收
在老年代中的对象，至少都已经历过一次甚至更多次垃圾回收，相对于新生代中的对象，它们有更大的概率继续存活，只有相对少数的对象面临死亡，且由于老年代的堆内存是新生代的几十倍，其中生活着大量对象，因此如果使用 Scavenge 算法回收老年代，将会面临大量的存活对象需要复制的情况，将老年代空间对半划分，也会浪费相当大的空间，效率低下。因此老年代垃圾回收主要采用标记清除(Mark-Sweep)和标记整理(Mark-Compact)。
这两种方式并非互相替代关系，而是配合关系，在不同情况下，选择不同方式，交替配合以提高回收效率。
新生代中死亡对象占多数，因此采用 Scavenge 算法只处理存活对象，提高效率。老年代中存活对象占多数，于是采用标记清除算法只处理死亡对象，提高效率。
当老年代的垃圾回收被触发时，V8 会将需要存活对象打上标记，然后将没有标记的对象，也就是需要死亡的对象，全部擦除，一次标记清除式回收就完成了：

灰色为存活对象，白色为清除后的闲置空间

一切看起来都完美了，可是随着程序的继续运行，却会出现一个问题：被清除的对象遍布各个内存地址，空间有大有小，其闲置空间不连续，产生了很多内存碎片。当需要将一个足够大的对象晋升至老年代时，无法找到一个足够大的连续空间安置这个对象。
为了解决这种空间碎片的问题，就出现了标记整理算法。它是在标记清除的基础上演变而来，当清理了死亡对象后，它会将所有存活对象往一端移动，使其内存空间紧挨，另一端就成为了连续内存：

虽然标记整理算法可以避免空间碎片，但是却需要依次移动对象，效率比标记清除算法更低，因此大多数情况下 V8 会使用标记清理算法，当空间碎片不足以安放新晋升对象时，才会触发标记整理算法。

增量标记（Incremental Marking）

早期 V8 在垃圾回收阶段，采用全停顿（stop the world），也就是垃圾回收时程序运行会被暂停。这在 JavaScript 还仅被用于浏览器端开发时，并没有什么明显的缺点，前端开发使用的内存少，大多数时候仅触发新生代垃圾回收，速度快，卡顿几乎感觉不到。但是对于 Node 程序，使用内存更多，在老年代垃圾回收时，全停顿很容易带来明显的程序迟滞，标记阶段很容易就会超过 100ms，因此 V8 引入了增量标记，将标记阶段分为若干小步骤，每个步骤控制在 5ms 内，每运行一段时间标记动作，就让 JavaScript 程序执行一会儿，如此交替，明显地提高了程序流畅性，一定程度上避免了长时间卡顿。

Node 开发中的内存管理与优化

2.1 手动变量销毁
当任一作用域存活于作用域栈（作用域链）时，其中的变量都不会被销毁，其引用的数据也会一直被变量关联，得不到 GC。有的作用域存活时间非常长（越是栈底，存活时间越长，最长的是全局作用域），但是其中的某些变量也许在某一时刻后就没有用处了，因此建议手动设置为 null，断开引用链接，使得 V8 可以及时 GC 释放内存。
注意，不使用 var 声明的变量，都会成为全局对象的属性。前端开发中全局对象为 window，Node 中全局对象为 global，如果 global 中有属性已经没有用处了，一定要设置为 null，因为全局作用域只有等到程序停止运行，才会销毁。
Node 中，当一个模块被引入，这个模块就会被缓存在内存中，提高下次被引用的速度。也就是说，一般情况下，整个 Node 程序中对同一个模块的引用，都是同一个实例（instance），这个实例一直存活在内存中。所以，如果任意模块中有变量已经不再需要，最好手动设置为 null，不然会白白占用内存，成为“活着的死对象”。

### 全局变量引起的内存泄漏

```js
function leaks() {
  leak = 'xxxxxx'; //leak 成为一个全局变量，不会被回收
}
```

### 闭包引起的内存泄漏

```js
const leaks = (function () {
  const leak = 'xxxxxx'; // 被闭包所引用，不会被回收
  return function () {
    console.log(leak);
  };
})();
```

### dom 清空或删除时，事件未清除导致的内存泄漏

```js
<div id="container"></div>;

$('#container')
  .bind('click', () => {
    console.log('click');
  })
  .remove();

// zepto 和原生 js下，#container dom 元素，还在内存里jquery 的 empty和 remove会帮助开发者避免这个问题

<div id="container"></div>;

$('#container')
  .bind('click', () => {
    console.log('click');
  })
  .off('click')
  .remove();
//把事件清除了，即可从内存中移除
```

## 运算符

- 赋值运算符: `=`
- 算术运算符
  - `+` `-` `*` `/`
  - `%`: 求余
    - `num % Infinity === num`（NaN 除外）
    - `Number.isNaN(Infinity % num) === true`
  - `**`: 求幂，返回第一个操作数做底数，第二个操作数做指数的乘方
  - `++`: 递增，分前置和后置，前置返回新值，后置返回原值
  - `--`: 递减，分前置和后置，前置返回新值，后置返回原值
- 位操作符
  - `&`: 与。对于每一个比特位，只有两个操作数相应的比特位都是 1 时，结果才为 1，否则为 0
  - `|`: 或。对于每一个比特位，当两个操作数相应的比特位至少有一个 1 时，结果为 1，否则为 0
  - `^`: 异或。对于每一个比特位，当两个操作数相应的比特位有且只有一个 1 时，结果为 1，否则为 0
  - `~`: 非。反转操作数的比特位，即 0 变成 1，1 变成 0
  - `<<`: 左移。将 a 的二进制形式向左移 b (< 32) 比特位，右边用 0 填充
  - `>>`: 有符号右移。将 a 的二进制表示向右移 b (< 32) 位，丢弃被移出的位
  - `>>>`: 无符号右移。将 a 的二进制表示向右移 b (< 32) 位，丢弃被移出的位，并使用 0 在左侧填充
- 比较操作符: `==` `===` `>=` `!==`
- 逻辑运算符: 逻辑运算符
  - `!`: 非。如果运算数是对象，返回 false
    - 如果运算数是非''字符串，返回 false
  - `&&`: 与。两边转换`boolean`，都为 true，返回后面的。有 false，直接返回 false 的，都为 false，返回前面的
  - `||`: 或。两边转换为`boolean` ，返回 true 的那个（都为 true 返回前面那个，都为 false 返回后面那个）
- 条件（三元）运算符: condition ? expr1 : expr2

计算一个负数的二进制补码，需要经过下列 3 个步骤:

1. 求这个数值绝对值的二进制码（例如，要求-18 的二进制补码，先求 18 的二进制码）
2. 求二进制反码，即将 0 替换为 1，将 1 替换为 0
3. 得到的二进制反码加 1

优先级：

1. `()`优先级最高
2. 一元运算符 `++` `--` `!`
3. 算数运算符 先`*` `/` `%`后`+` `-`
4. 关系运算符 `>` `>=` `<` `<=`
5. 相等运算符 `==` `!=` `===` `!==`
6. 逻辑运算符 先`&&`后`||`
7. 赋值运算符

## 数据类型

- 6 种 原始类型（primitives）:
  - Boolean
  - Null
  - Undefined
  - Number
  - BigInt
  - String
  - Symbol
- Object（引用类型）

类型检测：

- typeof: typeof 操作符可以确定一个变量是字符串、数值、布尔值，还是 undefined 。如果变量的值是一个对象或 null，则 typeof 操作符会返回"object"
- instanceof：instanceof 的原理是基于原型链的查询，只要处于原型链中，判断永远为 true。当然，如果使用 instanceof 操作符检测基本类型的值，则该操作符始终会返回 false

> typeof null === 'object'，null 的存储单元最后三位和 object 一样是 000。所以 typeof null 的结果被误判为 Object。

### 基本数据结构

栈: 只允许在一段进行插入或者删除操作的线性表，是一种先进后出的数据结构。

堆: 是基于散列算法的数据结构。

队列: 是一种先进先出（FIFO）的数据结构。

- 原始类型: 一些简单的数据段，按值访问，存储在栈内存中。不能给基本类型的值添加属性，这样不会导致任何错误，但也无效果。
- 引用类型: 由单个/多个值构成的对象引用类型的值，保存在堆内存中。JavaScript 不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。

### Number

JavaScript 的数字类型是基于 [double-precision 64-bit binary format IEEE 754 value](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)。它并没有为整数给出一种特定的类型。除了能够表示浮点数外，还有一些带符号的值: +Infinity，-Infinity 和 NaN (非数值，Not-a-Number)。

- Number()
- parseInt()
- parseFloat()
- toFixed()
- toString([radix])

### BigInt

BigInt 是一种新的数据类型，用于当整数值大于 Number 数据类型支持的范围时。这种数据类型允许我们安全地对大整数执行算术操作，表示高分辨率的时间戳，使用大整数 id，等等，而不需要使用库。

要创建 BigInt，只需要在数字末尾追加 n 即可。

### String

JavaScript 的字符串类型用于表示文本数据，16-bit unsigned integer values。在字符串中的每个元素占据了字符串的位置。第一个元素的索引为 0，下一个是索引 1，依此类推。字符串的长度是它的元素的数量。

JavaScript 字符串是不可更改的，但是，可以基于对原始字符串的操作来创建新的字符串。

使用字符串的方法时，JS 引擎会先对原始类型数据进行包装，然后对其方法进行调用（JavaScript 会新建一个内置对象 String，一旦引用结束，这个对象就会销毁，因此调用字符串的方法实际上是使用了 String 对象的方法）

模板字符串（template string）是允许嵌入表达式的字符串字面量，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。存在一个特殊的属性 raw ，我们可以通过它来访问模板字符串的原始字符串，而不经过特殊字符的替换。

#### Unicode

Unicode 的产生是为了处理不同语言之间的编码不兼容问题。

- `\xXX`: 其中`XX` 是介于 00 与 FF 之间的两位十六进制数，`\xXX` 表示 Unicode 编码为 XX 的字符。
- `\uXXXX`: 其中 `XXXX` 是 4 位十六进制数，值介于 0000 和 FFFF 之间。此时，\uXXXX 便表示 Unicode 编码为 XXXX 的字符。
- `\u{X…XXXXXX}`: 其中`X…XXXXXX` 是介于 0 和 10FFFF（Unicode 定义的最高码位）之间的 1 到 6 个字节的十六进制值。这种表示方式让我们能够轻松地表示所有现有的 Unicode 字符。

```js
'\u007A'; // z
'\u0061'; // "a"
'\u{1F60D}'; // '😍'
```

JavaScript 新增了 String.fromCodePoint 和 str.codePointAt 这两个方法来处理代理对。它们本质上与 String.fromCharCode 和 str.charCodeAt 相同，但它们可以正确地处理代理对。

代理对方案：

Unicode 采用了代理对（Surrogate Pair）来解决。

他选择了 D800-DBFF 编码范围作为前两个字节（utf-16 高半区），DC00-DFFF 作为后两个字节（utf-16 低半区），组成一个四个字节表示的字符。

当软件解析到 Unicode 连续 4 个字节的前两个是 utf-16 高半区，后两个是 utf-16 低半区，他就会把它识别为一个字符。如果配对失败，或者顺序颠倒则不显示。

D800-DBFF 可表示的编码范围有 10 位，DC00-DFFF 可表示的编码范围也有 10 位，加起来就是 20 位（00000-FFFFF），这样就可以表示${2^{20}}$个字符。在可见的未来都不会出现不够使用的情况。

而且代理对区间的编码不能单独映射字符，因此不会产生识别错误。

处理字符映射：

我们通过代理对解决了编码问题，但是对于人类阅读来说，“\uD800DC00”的表示方法还是太复杂。

而且和基本的两字节表示的 Unicode 编码放在一起看，并不连续。

因此 Unicode 将这 20 位的编码空间映射到了 10000-10FFFF，这样就能和 2 个字节 0000-FFFF 表示的编码空间在一起连续表示了。

所以\uD800\uDC00=\u10000，这也是我们部分语言调试下对 emoji 字符的码值显示会出现 5 个 HEX 的原因。

代码识别：

最后一个问题是编程语言识别问题，由于存在代理对，许多语言的 string.length 方法会将代理对中的字符（如 emoji）个数识别成 2 个。这样会造成一些诸如光标定位，字符提取等方面的问题。

对于 JavaScript，ES6 中有 String.fromCodePoint()，codePointAt()，for…of 循环等方式处理。

```js
String.fromCharCode(0x20BB7);
// "ஷ"

const s = '𠮷a';
s.codePointAt(0); // 134071
s.codePointAt(1); // 57271

s.codePointAt(2); // 97

for (const x of 'a\uD83D\uDC0A') {
  console.log(x);
}
// 'a'
// '\uD83D\uDC0A'
```

#### 八进制转义

`\XXX`，用正则表达式表示：，大概是 `/\\[0-7]{1,3}/` 这样的格式。"\"和数字开头。

所以 '\8'， '\09'， '\189' 会分别识别成 '8', '\x00' 和 '\x009', '\x0189'

- encodeURI()把字符串作为 URI 整体进行编码，所以 URI 组件中的特殊分隔符号（;/:@&=+\$?#），encodeURI() 函数不会进行转义。该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - \_ . ! ~ \* ' ( )

#### 十六进制转义

`\x` 开头

```js
'\u00123'.length; // 2
```

```js
encodeURI('shttp://www.baidu.com');
// https://www.baidu.com
```

- encodeURIComponent()把字符串作为 URI 组件的一部分（如 path/query/fragment 等）进行编码，所以用于分隔 URI 各个部分的特殊分隔符号（;/?:@&=+\$,#）也会被转义。返回值中某些字符将被十六进制的转义序列替换。该方法也不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - \_ . ! ~ \* ' ( )

```js
encodeURIComponent('https://www.baidu.com');
// https%3A%2F%2Fwww.baidu.com
```

> decodeUR 或 decodeURIComponent 解码被转义的字符

### Boolean

- undefined`: false
- null: false
- String`: 任何非空字符串为 true，空字符串为 false
- Number`: 任何非零数字值（包括无穷大）为 true，0 和 NaN 为 false
- Symbol: 都为 true
- Object: 都为 true

### Symbol

Symbol 值通过`Symbol`函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。

> 注意，Symbol 值作为对象属性名时，不能用点运算符。

```js
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello!';
a[mySymbol]; // undefined
a['mySymbol']; // "Hello!"
```

上面代码中，因为点运算符后面总是字符串，所以不会读取`mySymbol`作为标识名所指代的那个值，导致`a`的属性名实际上是一个字符串，而不是一个 Symbol 值。

#### Symbol.iterator

Symbol.iterator 属性指向默认遍历器方法，for…of 循环会调用这个方法

- js 原有的表示"集合"的数据结构，主要是数组和对象。ES6 添加了 Map 和 Set。这样就有了四种数据结构可以用于描述集合，但是需要一种接口体制来处理所有不同的数据结构
- 遍历器 Iterator 就是一种机制，是一种接口，可以为不同的数据结构提供统一的访问机制任何数据结构只要部署了 Iterator 接口，就可以完成遍历操作(依次处理该数据结构的所有成员)

Iterator 的遍历过程是创建一个指针对象，然后每次调用对象的 next 方法，返回当前成员的值

应用场合：

- 解构赋值
- 拓展运算符
- yield\*

```js
const myObject = {
  a: 2,
  b: 3,
};

Object.defineProperty(myObject, Symbol.iterator, {
  enumerable: false,
  writable: false,
  configurable: true,
  value() {
    const that = this; //eslint-disable-line @typescript-eslint/no-this-alias
    let index = -1;
    const keys = Object.keys(that);
    return {
      next() {
        index++;
        return {
          value: that[keys[index]],
          done: index >= keys.length,
        };
      },
    };
  },
});

// 手动迭代 `myObject`
const it = myObject[Symbol.iterator]();
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // { value:undefined, done:true }

// 用 `for..of` 迭代 `myObject`
for (const ele of myObject) {
  console.log(ele);
}
// 2
// 3
```

#### Symbol.toStringTag

对象的 Symbol.toStringTag 属性，指向一个方法。在该对象上面调用 Object.prototype.toString 方法时，如果这个属性存在，它的返回值会出现在 toString 方法返回的字符串之中，表示对象的类型

```js
({ [Symbol.toStringTag]: 'Foo' }).toString();
class Collection {
  get [Symbol.toStringTag]() {
    return 'shenyang';
  }
}
const x = new Collection();
Object.prototype.toString.call(x); // "[object shenyang]"

const obj = {};
Object.defineProperty(obj, Symbol.toStringTag, {
  value: 'shenyang',
});
Object.prototype.toString.call(obj); // [object shenyang]
```

### Array

[数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)是一组按顺序排列的元素的集合。JavaScript 的数组可以包括任意数据类型

JavaScript 中数组实质上是数组是一个键值映射，数组也是对象

> 注: 操作数组的方法中，只有 slice()、join()不改变原数组而返回一个新的数组

```js
[1, 2, 3]; // 创建了数组 [1, 2, 3]
Array.from({ length: 3 }); // 创建 length === 3 的数组

const obj = [1, 2, 3];

Array.isArray(obj); // true
obj.constructor === Array;
Object.prototype.toString.call(obj) === '[object Array]';
Array.isArray(obj);
```

#### 伪数组

是一种按照索引存储数据且具有 length 属性的对象。因为是对象，所以不能调用数组的方法。

- 存在 length
- 可以遍历
- 可通过索引操作
- 不能使用数组的方法

如：函数中的 arguments、document.querySelectorAll() 等批量选择元素的方法的返回值、`<input/>` 文件上传后的 files

### Set

ES6 新增的一种新的数据结构，类似于数组，但成员唯一且无序的，没有重复的值。

```js
const s = new Set([iterable]);
```

Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是 NaN 等于自身。

### WeakSet

WeakSet 对象允许你将弱引用对象储存在一个集合中

WeakSet 与 Set 的区别：

- WeakSet 只能储存对象引用，不能存放值，而 Set 对象都可以
- WeakSet 对象中储存的对象值都是被弱引用的，即垃圾回收机制不考虑 WeakSet 对该对象的应用，如果没有其他的变量或属性引用这个对象值，则这个对象将会被垃圾回收掉（不考虑该对象还存在于 WeakSet 中），所以，WeakSet 对象里有多少个成员元素，取决于垃圾回收机制有没有运行，运行前后成员个数可能不一致，遍历结束之后，有的成员可能取不到了（被垃圾回收了），WeakSet 对象是无法被遍历的（ES6 规定 WeakSet 不可遍历），也没有办法拿到它包含的所有元素

### Map

Map 对象保存键值对，任何值(对象或者原始值) 都可以作为一个键或一个值

```js
const map = new Map([
  ['name', 'shen'],
  ['age', 18],
]);
map.get('name'); // "shen"
```

### WeakMap

1. 只接受对象作为键名（null 除外），不接受其他类型的值作为键名
2. 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
3. 不能遍历，方法有 get、set、has、delete

> WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用

### Object

JavaScript 的对象是一组由键-值组成的无序集合。JavaScript 对象的键都是字符串类型，值可以是任意数据类型。

```js
const obj = {};

// 工厂函数
// 缺点：有办法识别对象实例的类型，创建出来的对象都是 Object 类型的。
function createPerson(name, age) {
  // 声明一个中间对象，该对象就是工厂模式的模子
  const o = new Object();
  o.name = name;
  o.age = age;
  o.getName = function () {
    return this.name;
  };
  return o;
}
const peron1 = createPerson('TOM', 20);
```

#### constructor

每个对象实例都具有 constructor 属性，它指向创建该实例的构造器函数

new 在执行时:

1. 声明一个中间对象
2. 将该中间对象的原型指向构造函数的原型
3. 将构造函数的 this，指向该中间对象
4. 返回该中间对象，即返回实例对象

> 注意，如果构造函数返回了对象，new 出的对象就是这个返回的对象。返回非对象对构造函数无影响。

```js
// 模拟 new
function _new(...rest) {
  // 1、创建一个新对象
  const obj = Object.create({}); // 也可以写成 const obj = {}
  // 2、将this指向该对象
  const Fn = Array.prototype.shift.call(rest); // 把构造函数分离出来
  const returnObj = Fn.apply(obj, rest); // 通过apply将this指向由Fn变为obj

  // 3、将新对象的原型指向构造函数的原型
  obj.__proto__ = Fn.prototype;

  // 4、返回对象（如果构造函数有返回对象，那么就返回构造函数的对象，如果没有就返回新对象）
  return Object.prototype.toString.call(returnObj) == '[object Object]'
    ? returnObj
    : obj;
}

function _new1(Fn, ...arg) {
  const obj = Object.create(Fn.prototype);
  const result = Fn.apply(obj, arg);
  return Object.prototype.toString.call(result) == '[object Object]'
    ? result
    : obj;
}
```

#### 包装对象

基本类型没有方法，但仍然表现得像有方法一样。当在基本类型上访问属性时，JavaScript 自动将值装入包装器对象中，并访问该对象上的属性。

这种自动装箱行为在 JavaScript 代码中是无法观察到的，但却是各种行为的一个很好的心理模型——例如，为什么“改变”基本类型不起作用（因为 str.Foo = 1 不是赋值给 str 本身的 Foo 属性，而是赋值给了一个临时包装器对象）

```js
let s = new Object('1');
s.toString();
s = null;
```

> 为什么不是 new String ？由于 Symbol 和 BigInt 的出现，对它们调用 new 都会报错，目前 ES6 规范也不建议用 new 来创建基本类型的包装类。

#### 类型转换

对象转原始类型，会调用内置的[ToPrimitive]函数，对于该函数而言，其逻辑如下：

1. 如果 Symbol.toPrimitive()方法，优先调用再返回
2. 调用 valueOf()，如果转换为原始类型，则返回
3. 调用 toString()，如果转换为原始类型，则返回
4. 如果都没有返回原始类型，会报错

#### Date

用来表示日期和时间

```js
const date = new Date(1678172811448); // Tue Mar 07 2023 15:06:51 GMT+0800 (中国标准时间)
date.toUTCString(); // Tue, 07 Mar 2023 07:06:51 GMT
```

#### Math

ECMAScript 还为保存数学公式和信息提供了一个公共位置，即 Math 对象。与我们在 JavaScript 直接编写的计算功能相比，Math 对象提供的计算功能执行起来要快得多。Math 对象中还提供了辅助完成这些计算的属性和方法。

- Math.E：自然对数的底数，即常量 e 的值
- Math.PI：π 的值
- Math.SQRT2：2 的平方根
- ceil()：向上取整
- floor()：向下取整
- round()：四舍五入取整
- random()：返回大于等于 0 小于 1 的一个随机数，不包括 1

#### Error

```js
new Error(message);

const e1 = new Error('hello error');
console.log(e1.toString()); // "Error: hello error
```

自定义 Error:

```js
class CustomError extends Error {
  constructor(foo = 'bar', ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = 'CustomError';
    // Custom debugging information
    this.foo = foo;
    this.date = new Date();
  }
}

try {
  throw new CustomError('baz', 'bazMessage');
} catch (e) {
  console.error(e.name); // CustomError
  console.error(e.foo); // baz
  console.error(e.message); // bazMessage
  console.error(e.stack); // stacktrace
}
```

#### 顶层对象

在浏览器指的是`window`对象，在 Node 指的是`global`对象。ES5 之中，顶层对象的属性与全局变量是等价的。

- 浏览器中是 window，但 Node 和 Web Worker 没有 window。
- 浏览器和 Web Worker 中，self 也指向顶层对象，但 Node 没有 self
- Node: global，但其他环境都不支持

> 可以使用 [globalThis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis#html_and_the_windowproxy) 指向顶层对象。

#### prototype

prototype 属性指向一个对象，你在这个对象中定义需要被继承的成员。

可以用 prototype 给对象添加属性和方法，这些属性和方法都是可以被继承的。

```js
// 声明构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 通过prototye属性，将方法挂载到原型对象上
Person.prototype.getName = function () {
  return this.name;
};

const p1 = new Person('tim', 10);
const p2 = new Person('jak', 22);
console.log(p1.getName === p2.getName); // true
```

#### 原型链

原型链的访问，其实跟作用域链有很大的相似之处，他们都是一次单向的查找过程。因此实例对象能够通过原型链，访问到处于原型链上对象的所有属性与方法。

- 构造函数继承：在 new 内部实现的一个复制过程。而我们在继承时，就是想父级构造函数中的操作在子级的构造函数中重现一遍即可。我们可以通过 call 方法来达到目的。
- 原型继承：将子级的原型对象设置为父级的一个实例，加入到原型链中即可。
- 经典继承：ES5 中新增了一个方法`Object.create()`,方法会使用指定的原型对象及其属性去创建一个新的对象

```js
// 创建无 Object.prototype 的原型链对象

// method 1
const obj1 = Object.create(null);

// method 2
const obj2 = {};
Object.setPrototypeOf(obj2, null);

// method 3
const obj3 = {};
obj3.__proto__ = null;

[obj1, obj2, obj3].forEach((item) => {
  console.log(item instanceof Object); // false
});
```

#### class

ECMAScript 2015 中引入的 JavaScript 类(`classes`) 实质上是 JavaScript 现有的基于原型的继承的语法糖。 类语法不是向 JavaScript 引入一个新的面向对象的继承模型。JavaScript 类提供了一个更简单和更清晰的语法来创建对象并处理继承。

```js
// ES5
// 构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 原型方法
Person.prototype.getName = function () {
  return this.name;
};
```

class

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getName() {
    // 这种写法表示将方法添加到原型中
    return this.name;
  }

  static a = 20; // 等同于 Person.a = 20

  c = 20; // 表示在构造函数中添加属性 在构造函数中等同于 this.c = 20

  // 箭头函数的写法表示在构造函数中添加方法，在构造函数中等同于this.getAge = function() {}
  getAge = () => this.age;
}

// Student类继承Person类
class Student extends Person {
  constructor(name, age, gender, classes) {
    super(name, age); // 构造函数的继承
    this.gender = gender;
    this.classes = classes;
  }

  getGender() {
    return this.gender;
  }
}
```

继承

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getName() {
    return this.name;
  }
}

// Student类继承Person类
class Student extends Person {
  constructor(name, age, gender, classes) {
    super(name, age); // 构造函数的继承
    this.gender = gender;
    this.classes = classes;
  }

  getGender() {
    return this.gender;
  }
}
```

静态方法

`static` 关键字用来定义一个类的一个静态方法。调用静态方法不用[实例化](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#The_object_(class_instance)>)其类，但不能通过一个类实例调用静态方法。静态方法通常用于为一个应用程序创建工具函数。

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.hypot(dx, dy);
  }
}

const p1 = new Point(5, 5);
const p2 = new Point(10, 10);

console.log(Point.distance(p1, p2));
```

当调用静态或原型方法时，没有值为“this”的对象(或“this”作为布尔，字符串，数字，未定义或 null) ，那么“this”值在被调用的函数内部将为**undefined**。不会发生自动装箱。即使我们以非严格模式编写代码，它的行为也是一样的，因为所有的函数、方法、构造函数、getters 或 setters 都在严格模式下执行。因此如果我们没有指定 this 的值，this 值将为**undefined**。

```js
class Animal {
  speak() {
    return this;
  }
  static eat() {
    return this;
  }
}

const obj = new Animal();
const speak = obj.speak;
speak(); // undefined

const eat = Animal.eat;
eat(); // undefined
```

如果我们使用传统的基于函数的类来编写上述代码，那么基于调用该函数的“this”值将发生自动装箱。

```js
function Animal() {
  // do ...
}

Animal.prototype.speak = function () {
  return this;
};

Animal.eat = function () {
  return this;
};

const obj = new Animal();
const speak = obj.speak;
speak(); // global object

const eat = Animal.eat;
eat(); // global object
```

#### proxy

Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）,在对目标对象的操作之前提供了拦截，可以对外界的操作进行过滤和改写

```js
const p = new Proxy(target, handler);
//代理数组
const proxyArr = new Proxy([], {
  get: (target, key, receiver) => {
    console.log(`getting ${key}!`);
    return target[key];
  },
  set: (target, key, value, receiver) => {
    console.log(target, key, value, receiver);
    return (target[key] = value);
  },
});
```

#### Reflect

将 Object 对象的一些明显属于语言内部的方法（比如 Object.defineProperty），放到 Reflect 对象上。现阶段，某些方法同时在 Object 和 Reflect 对象上部署，未来的新方法将只部署在 Reflect 对象上。也就是说，从 Reflect 对象上可以拿到语言内部的方法。

修改某些 Object 方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而 Reflect.defineProperty(obj, name, desc)则会返回 false。

#### URLSearchParams

定义了一些实用的方法来处理 URL 的查询字符串

```js
const paramsString = 'q=URLUtils.searchParams&topic=api';
const searchParams = new URLSearchParams(paramsString);

//Iterate the search parameters.
for (const p of searchParams) {
  console.log(p);
}

searchParams.has('topic') === true; // true
searchParams.get('topic') === 'api'; // true
searchParams.getAll('topic'); // ["api"]
searchParams.get('foo') === null; // true
searchParams.append('topic', 'webdev');
searchParams.toString(); // "q=URLUtils.searchParams&topic=api&topic=webdev"
searchParams.set('topic', 'More webdev');
searchParams.toString(); // "q=URLUtils.searchParams&topic=More+webdev"
searchParams.delete('topic');
searchParams.toString(); // "q=URLUtils.searchParams"
```

### 函数

函数实际上是对象。每个函数都是 Function 类型的实例，而且都与其他引用类型一样具有属性和方法。由于函数是对象，因此函数名实际上也是一个指向函数对象的指针，不会与某个函数绑定。

> 函数的 name 属性无法更改
> 可以通过 arguments 对象来访问参数

- length：返回没有指定默认值的参数个数。也就是说，指定了默认值后，length 属性将失真。
- apply、call、bind：执行 this 指向。

要指定函数的 `this` 指向哪个对象，可以用函数本身的 `apply` 方法，它接收两个参数，第一个参数就是需要绑定的 `this` 变量，第二个参数是 `Array`，表示函数本身的参数。

`apply` 和 `call` 类似，唯一区别是：

- `apply` 把参数打包成 Array 再传入
- `call` 把参数按顺序传入

```js
Function.prototype._call = function (context = window, ...rest) {
  context.fn = this;

  const args = [...rest];

  const result = context.fn(...args);
  // 执行完后干掉
  delete context.fn;
  return result;
};

Function.prototype._apply = function (context = window, ...rest) {
  context.fn = this;

  let result;
  // 判断 arguments[1] 是不是 undefined
  if (rest[0]) {
    result = context.fn(...rest[0]);
  } else {
    result = context.fn();
  }

  delete context.fn;
  return result;
};
```

```js
// 默认值
function log(x = 'shen') {
  x; // shen
}

// 参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。
const x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo(); // 100
foo(); // 100

// rest
function fn(a, b, ...rest) {
  console.log(rest);
}

fn(1, 2, 3, 4, 5);
// 结果:
// Array [ 3, 4, 5 ]
```

#### 作用域

如果一个变量在函数体内部申明，则该变量的作用域为整个函数体，在函数体外不可引用该变量。

如果两个不同的函数各自申明了同一个变量，那么该变量只在各自的函数体内起作用，不同函数内部的同名变量互相独立，互不影响。

由于 JavaScript 的函数可以嵌套，此时，内部函数可以访问外部函数定义的变量，反过来则不行。

何程序设计语言都有作用域（技术上讲称为 词法作用域）的概念，简单的说，作用域就是变量与函数的可访问范围，作用域控制着变量与函数的可见性和生命周期。

每次当控制器转到可执行代码的时候，就会进入一个执行上下文。执行上下文可以理解为当前代码的执行环境，它会形成一个作用域。JavaScript 中的运行环境大概包括三种情况。

- 全局环境：JavaScript 代码运行起来会首先进入该环境
- 函数环境：当函数被调用执行时，会进入当前函数中执行代码
- eval（不建议使用，可忽略）

在一个 JavaScript 程序中，必定会产生多个执行上下文，JavaScript 引擎会以栈的方式来处理它们，这个栈，我们称其为函数调用栈(call stack)。栈底永远都是全局上下文，而栈顶就是当前正在执行的上下文。

`try-catch` 语句的 `catch 块` 和 `with 语句` 会在作用域链的前端增加一个变量对象。对`with`语句来说，会将指定的对象添加到作用域链中。对 `catch` 语句来说，会创建一个新的变量对象，其中包含的是被抛出的错误对象的声明。

with 的常见方式是作为一种缩写，来引用一个对象的多个属性，而 不必 每次都重复对象引用本身。

```js
const obj = {
  a: 1,
  b: 2,
  c: 3,
};

//  重复“obj”显得更“繁冗”
obj.a = 2;
obj.b = 3;
obj.c = 4;

// “更简单”的缩写
// with (obj) {
//   a = 3;
//   b = 4;
//   c = 5;
// }
```

with 语句接收一个对象，这个对象有 0 个或多个属性，并 将这个对象视为好像它是一个完全隔离的词法作用域，因此这个对象的属性被视为在这个“作用域”中词法定义的标识符。

尽管一个 with 块儿将一个对象视为一个词法作用域，但是在 with 块儿内部的一个普通 var 声明将不会归于这个 with 块儿的作用域，而是归于包含它的函数作用域。

with 实质上是通过将一个对象引用看作一个“作用域”，并将这个对象的属性看作作用域中的标识符，（同样，也是在运行时）创建一个全新的词法作用域，压制了引擎在作用域查询上进行编译期优化的能力。

#### 高阶函数

一个函数就可以接收另一个函数作为参数或者返回值为一个函数，这种函数就称之为高阶函数。

```js
function add(x, y, f) {
  return f(x) + f(y);
}
```

编写高阶函数，就是让函数的参数能够接收别的函数。

#### 闭包

1. 红宝书(p178)上对于闭包的定义：闭包是指有权访问另外一个函数作用域中的变量的函数，
2. MDN 对闭包的定义为：闭包是指那些能够访问自由变量的函数。（其中自由变量，指在函数中使用的，但既不是函数参数 arguments 也不是函数的局部变量的变量，其实就是另外一个函数作用域中的变量。）
3. chrome 中，则以执行上下文 A 的函数名代指闭包。

```js
function foo() {
  const a = 20;
  const b = 30;

  function bar() {
    return a + b;
  }

  return bar;
}

const bar = foo();
bar();
```

函数的执行上下文，在执行完毕之后，生命周期结束，那么该函数的执行上下文就会失去引用。其占用的内存空间很快就会被垃圾回收器释放。可是闭包的存在，会阻止这一过程。

闭包有非常强大的功能：

- 私有变量
- 柯里化
- 模块

#### 匿名函数立即执行（IIFE）

```js
(function () {
  //这里是块级作用域
})();
```

#### Generator

借鉴了 Python 的 generator 的概念和语法

函数在执行过程中，如果没有遇到 return 语句（函数末尾如果没有 return，就是隐含的 return undefined;），控制权无法交回被调用的代码。

generator 跟函数很像，定义如下：

```js
function* foo(x) {
  yield x + 1;
  yield x + 2;
  return x + 3;
}

const gen = foo(1);
gen.next(); // { "value": 2, "done": false }
```

以斐波那契数列为例，它由 0，1 开头：

`0 1 1 2 3 5 8 13 21 34 ...`

要编写一个产生斐波那契数列的函数，可以这么写：

```js
function fib(max) {
  let t,
    a = 0,
    b = 1;
  const arr = [0, 1];
  while (arr.length < max) {
    t = a + b;
    a = b;
    b = t;
    arr.push(t);
  }
  return arr;
}

// 测试:
fib(5); // [0, 1, 1, 2, 3]
fib(10); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

函数只能返回一次，所以必须返回一个 Array。但是，如果换成 generator，就可以一次返回一个数，不断返回多次。用 generator 改写如下：

```js
function* fib(max) {
  let t,
    a = 0,
    b = 1,
    n = 1;
  while (n < max) {
    yield a;
    t = a + b;
    a = b;
    b = t;
    n++;
  }
  return a;
}
```

#### 柯里化

柯里化[Currying]，将接受多个参数的函数变换成接受部分参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术，使应用易于组合、测试。

```js
const curryingAdd = function () {
  const allArgs = [];
  const next = (...args) => {
    allArgs.push(...args);
    return curryedFn;
  };

  next.toString = function () {
    const total = allArgs.reduce((total, num) => total + num, 0);
    return total;
  };

  next.valueOf = function () {
    const total = allArgs.reduce((total, num) => total + num, 0);
    return total;
  };
  return next;
};
const add = curryingAdd();
`${add(1)(2)}`; // '3'

const currying = (fn) => {
  const judge = (...args) => {
    if (args.length === fn.length) {
      return fn(...args);
    } else {
      return (...arg) => judge(...args, ...arg);
    }
  };
  return judge;
};
```

#### 函数的四种调用模式

> 根据函数内部 this 的指向不同，可以将函数的调用模式分成 4 种

1. 函数调用模式：一个函数不是一个对象的属性时，就是被当做一个函数来进行调用的。此时 this 指向了 window
2. 方法调用模式：当一个方法被调用时，this 被绑定到当前对象
3. 构造函数调用模式：通过 new 关键字进行调用，此时 this 被绑定到创建出来的新对象上
4. 上下文调用模式（借用方法模式）

#### eval

它只接受一个参数，即要执行的 ECMAScript（或 JavaScript） 字符串：

```js
eval("alert('hi')"); //等价于 alert("hi");
```

当解析器发现代码中调用 eval() 方法时，它会将传入的参数当作实际的 ECMAScript 语句来解析，然后把执行结果插入到原位置。通过 eval() 执行的代码被认为是包含该次调用的执行环境的一部分，因此被执行的代码具有与该执行环境相同的作用域链。这意味着通过 eval() 执行的代码可以引用在包含环境中定义的变量：

```js
const msg = 'hello world';
eval('alert(msg)'); //"hello world"
```

注意：_在 eval() 中创建的任何变量或函数都不会被提升，因为在解析代码的时候，它们被包含在一个字符串中；它们只在 eval()执行的时候创建。_

严格模式下，在外部访问不到 eval()中创建的任何变量或函数，因此前面两个例子都会导致错误。同样，在严格模式下，为 eval 赋值也会导致错误。

- 执行字符串代码
- 将 json 字符串转换成 JS 对象

注意：eval 函数的功能非常的强大，但是实际使用的情况并不多。

- eval 形式的代码难以阅读
- eval 形式的代码无法打断点，因为本质还是还是一个字符串
- 在浏览器端执行任意的 JavaScript 会带来潜在的安全风险，恶意的 JavaScript 代码可能会破坏应用

## Destructuring assignment

按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构。

```js
let a, b, rest;
[a, b] = [10, 20];
a; // 10
b; // 20

[a, b, ...rest] = [10, 20, 30, 40, 50];
rest; // Array [30, 40, 50]

// 字符串
[a, b, c, d] = 'shen';
a; // "s"
b; // "h"
c; // "e"
d; // "n"

// 别名
const { foo: alias } = { foo: 'aaa', bar: 'bbb' };
alias; // aaa
foo; // Uncaught ReferenceError: foo is not defined

// 默认值
const { defalut: alias1 = 123 } = { foo: 'aaa', bar: 'bbb' };
alias; // 123
```

## Strict Mode "use strict"

可以为一个单独的函数、或是一个文件切换到 strict 模式

启用 strict 模式的方法是在 JavaScript 代码的第一行写上：`'use strict';`

- 全局变量必须显示声明
- 禁止 this 指向 window 对象
- 禁止重名（函数参数、对象属性等）
- 新增了一些保留字

## 变量

变量在 JavaScript 中就是用一个变量名表示，变量名是大小写英文、数字、`$`和`_`的组合，且不能用数字开头。变量名也不能是 JavaScript 的关键字，大小写敏感。

### 变量声明

var、let、const、function、class

### with 语句

with 语句的作用是将代码的作用域设置到一个特定的对象中。with 语句的语法如下：

`with (expression) statement;`

定义 with 语句的目的主要是为了简化多次编写同一个对象的工作，这意味着在`with`语句的代码块内部，每个变量首先被认为是一个局部变量，而如果在局部环境中找不到该变量的定义，就会查询 with 定义的对象中是否有同名的属性。如果发现了同名属性，则以 with 定义的对象属性的值作为变量的值。严格模式下不允许使用`with`语句，否则将视为语法错误。

## 兼容

### polyfill

[polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill) 是指则很难对一个新特性的定义，制造一段行为等价的代码，这段代码可以运行在老版本的 JS 环境中。

```js
if (!Number.isNaN) {
  Number.isNaN = function isNaN(x) {
    return x !== x;
  };
}
```

并不是所有的新特性都可以完全填补。有时一种特性的大部分行为可以被填补，但是仍然存在一些小的偏差。在实现填补时应当小心确保尽可能严格地遵循语言规范。

### 转译器

使用一个工具将你的新版本代码转换为等价的老版本代码，这个处理通常被称为“转译器（transpiling）”。例如：

```js
function foo(a = 2) {
  console.log(a);
}

foo(); // 2
foo(42); // 42

// 转译器转义后：
// function foo() {
//   const a = arguments[0] !== void 0 ? arguments[0] : 2;
//   console.log(a);
// }
```

转译器推荐：

- [Babel](https://babeljs.io/): 前身为 6to5
