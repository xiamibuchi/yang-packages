# encoding

## js

ECMAScript 字符串使用的是 UTF-16 编码。

utf-8 编码需要占用 1~4 个字节不等，而使用 utf-16 则需要占用 2 或 4 个字节。

> 定与不定: UTF-16 最小的码元是两个字节，即使第一个字节可能都是 0 也要占位，这是固定的。不定是对于基本平面（BMP）的字符只需要两个字节，表示范围 U+0000 ~ U+FFFF，而对于补充平面则需要占用四个字节 U+010000~U+10FFFF。

### UTF-16 的编码逻辑

UTF-16 编码很简单，对于给定一个 Unicode 码点 cp（CodePoint 也就是这个字符在 Unicode 中的唯一编号）:

如果码点小于等于 U+FFFF（也就是基本平面的所有字符），不需要处理，直接使用。
否则，将拆分为两个部分 ((cp – 65536) / 1024) + 0xD800，((cp – 65536) % 1024) + 0xDC00 来存储。

```js
// A U+0041
A === '\u0041';

// 💩 U+1f4a9
'💩' === '\uD83D\uDCA9';

'\u0041' === '\u{41}';

'\uD83D\uDCA9' === '\u{1F4A9}';
```

在 ECMAScript 操作解释字符串值的地方，每个元素都被解释为单个 UTF-16 代码单元。

```js
'吉'.length;
// 1

'𠮷'.length;
// 2

'❤'.length;
// 1

'💩'.length;
// 2

let str = '👻yo𠮷';
for (let i = 0; i < str.length; i++) {
  console.log(str[i]);
}

// -> �
// -> �
// -> y
// -> o
// -> �
// -> �

let str = '👻yo𠮷';
for (const char of str) {
  console.log(char);
}

// -> 👻
// -> y
// -> o
// -> 𠮷

[...'💩'].length === 1;
```
