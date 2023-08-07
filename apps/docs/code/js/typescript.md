# TypeScript

TypeScript 是 JavaScript 的一个超集

## 优势

- 类型系统实际上是最好的文档
- 可以在编译阶段就发现大部分错误
- 增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等
- TypeScript 是 JavaScript 的超集，.js 文件可以直接重命名为 .ts 即可
- 即使不显式的定义类型，也能够自动做出类型推论
- 可以定义从简单到复杂的几乎一切类型
- 即使 TypeScript 编译报错，也可以生成 JavaScript 文件
- 兼容第三方库，即使第三方库不是用 TypeScript 写的，也可以编写单独的类型文件供 TypeScript - 读取

## 类型

- boolean
- number
- string
- bigint
- symbol
- void
- null 和 undefined
- any
- unknown: not legal to do anything with an unknown value

```typescript
let num: number = 7;
let str: string | number = 'str';

// automatically infer the types
let str = 'seven';
str = 7;
// Type 'number' is not assignable to type 'string'.

let list: number[] = [1, 1, 4];
let list: Array<number> = [5, 1, 4];

let list: number[] = [1, '2', 3];
// Type 'string' is not assignable to type 'number'.

function fn(name: string): string {
  return `我的名字是：${name}`;
}

// 可选
function fn(name?: string): string {
  return `我的名字是：${name || '未知'}`;
}

type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor('hello');
}

// 类型别名
type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: boolean;
};

type ID = number | string;

type EventNames = 'click' | 'scroll' | 'mousemove';

// Type Assertions
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement;
```

> 与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 number 类型的变量

> 如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型
> 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查

### Interfaces

```typescript
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });

// 任意属性
interface Person {
  name: string;
  age?: number;
  [propName: string]: any;
}

// 只读
interface Person {
  readonly id: number;
  name: string;
  age?: number;
  [propName: string]: any;
}
// 只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候

interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}
```

### 重载

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

比如，我们需要实现一个函数 `reverse`，输入数字 `123` 的时候，输出反转的数字 `321`，输入字符串 `'hello'` 的时候，输出反转的字符串 `'olleh'`。

利用联合类型，我们可以这么实现：

```typescript
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  }
  return x;
}
```

然而这样有一个缺点，就是不能够精确的表达，输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。

这时，我们可以使用重载定义多个 `reverse` 的函数类型：

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  }
}
```

上例中，我们重复定义了多次函数 `reverse`，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。

注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

### 声明文件

https://ts.xcatliu.com/basics/declaration-files

当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能

### 内置对象

JavaScript 中有很多[内置对象](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)，它们可以直接在 TypeScript 中当做定义好了的类型。

内置对象是指根据标准在全局作用域（Global）上存在的对象。这里的标准是指 ECMAScript 和其他环境（比如 DOM）的标准。

#### ECMAScript 的内置对象

ECMAScript 标准提供的内置对象有：

`Boolean`、`Error`、`Date`、`RegExp` 等。

我们可以在 TypeScript 中将变量定义为这些类型：

```
let b: Boolean = new Boolean(1);
let e: Error = new Error('Error occurred');
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

更多的内置对象，可以查看 [MDN 的文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)。

而他们的定义文件，则在 [TypeScript 核心库的定义文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib)中。

#### DOM 和 BOM 的内置对象

DOM 和 BOM 提供的内置对象有：

`Document`、`HTMLElement`、`Event`、`NodeList` 等。

TypeScript 中会经常用到这些类型：

```
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
document.addEventListener('click', function(e: MouseEvent) {
  // Do something
});
```

它们的定义文件同样在 [TypeScript 核心库的定义文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib)中。

#### TypeScript 核心库的定义文件

[TypeScript 核心库的定义文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib)中定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。

当你在使用一些常用的方法的时候，TypeScript 实际上已经帮你做了很多类型判断的工作了，比如：

```
Math.pow(10, '2');
// index.ts(1,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

上面的例子中，`Math.pow` 必须接受两个 `number` 类型的参数。事实上 `Math.pow` 的类型定义如下：

```ts
interface Math {
  /**
   * Returns the value of a base expression taken to a specified power.
   * @param x The base value of the expression.
   * @param y The exponent value of the expression.
   */
  pow(x: number, y: number): number;
}
```

再举一个 DOM 中的例子：

```ts
document.addEventListener('click', (e) => {
  console.log(e.targetCurrent);
});
// index.ts(2,17): error TS2339: Property 'targetCurrent' does not exist on type 'MouseEvent'.
```

上面的例子中，`addEventListener` 方法是在 TypeScript 核心库中定义的：

```ts
interface Document
  extends Node,
    GlobalEventHandlers,
    NodeSelector,
    DocumentEvent {
  addEventListener(
    type: string,
    listener: (ev: MouseEvent) => any,
    useCapture?: boolean
  ): void;
}
```

所以 `e` 被推断成了 `MouseEvent`，而 `MouseEvent` 是没有 `targetCurrent` 属性的，所以报错了。

> TypeScript 核心库的定义中不包含 Node.js 部分。

#### 用 TypeScript 写 Node.js

Node.js 不是内置对象的一部分，如果想用 TypeScript 写 Node.js，则需要引入第三方声明文件：

```
npm install @types/node --save-dev
```

### 元组

数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。

元组起源于函数编程语言（如 F#），这些语言中会频繁使用元组。

定义一对值分别为 `string` 和 `number` 的元组：

```ts
const tom: [string, number] = ['Tom', 25];
```

当赋值或访问一个已知索引的元素时，会得到正确的类型：

```ts
let tom: [string, number];
tom[0] = 'Tom';
tom[1] = 25;
tom[0].slice(1);
tom[1].toFixed(2);
```

也可以只赋值其中一项：

```ts
let tom: [string, number];
tom[0] = 'Tom';
```

但是当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元组类型中指定的项。

```ts
const tom: [string, number] = ['Tom', 25];
```

```ts
const tom: [string, number] = ['Tom'];
// Property '1' is missing in type '[string]' but required in type '[string, number]'.
```

#### 越界的元素

当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型：

```ts
const tom: [string, number] = ['Tom', 25];
tom.push('male', true);
// Argument of type 'true' is not assignable to parameter of type 'string | number'.
```

### Enums

枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等

枚举使用 `enum` 关键字来定义：

```typescript
// 默认从 0 开始递增，可以设置开始递增的数字
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = 'YES',
}
```

### 泛型

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

```ts
function createArray<T>(length: number, value: T): Array<T> {
  const result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}

createArray<string>(3, 'x'); // ['x', 'x', 'x']

function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

### 关键字

- keyof：得到这个类型的所有属性名构成的联合类型
- typeof：将得到这个实例的类型
- extends：在类型运算中的作用，不是继承或者扩展，而是判断一个类型是否可以被赋值给另一个类型。如上面的类型 TB，是一个函数，因此这个类型是可以赋值给类型 Function
- infer：类型提取

```ts
type User = {
  name: string;
  age: number;
};

type TA = keyof User;
// 'name' | 'age'

const fn = () => ({ name: 'blasius', age: 18 });
type TB = typeof fn;
// () => {name: string, age: number}

function logLength<T>(arg: T) {
  console.log(arg.length);
  // Property 'length' does not exist on type 'T'.
}
// 定义一个类型ILengthy
interface ILengthy {
  length: number;
}
function logLength2<T extends ILengthy>(arg: T) {
  console.log(arg.length);
}

type UserPromise = Promise<User>;
type UnPromisify<T> = T extends Promise<infer V> ? V : never;
type InferedUser = UnPromisify<UserPromise>;
// { name: number; age: string; }
```

## 方法

### ReturnType

```ts
const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
  // ...
}, 2000);

const timer: number | undefined = window.setTimeout(() => {
  // ...
}, 2000);
```

### Partial、Required、Readonly、Mutable

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
type PartialUser = MyPartial<User>;
// { name?: string, age?: number }
type TUserKeys = keyof User;
// 'name' | 'age'
type TName = User['name'];
// string
type TAge = User['age'];
// number
type TUserValue = User[TUserKeys];
// string | number
```

### Record<K, T>、Pick<T, K>

```ts
type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};
type TKeyofAny = keyof any;
// string | number | symbol
type TKeys = 'a' | 'b' | 0;
type TKeysUser = MyRecord<TKeys, User>;
// {a: User, b: User, 0: User}
```

## 项目中使用 ts

## config

tsconfig.json

```json
{
  "compilerOptions": {
    "outDir": "./dist", // ts 编译后的 js 文件
    "rootDir": "..", // 根目录，默认 tsconfig 所在文件夹
    "baseUrl": "./",
    "module": "commonjs",
    "declaration": true, // 自动生成声明文件
    "declarationDir": "dist/types", // 声明文件所在文件夹，默认 js 文件同级目录
    "removeComments": true, // 删除注释
    "lib": ["ES5", "ES2015.Promise", "DOM"], // 导入哪些标准库
    "typeRoots": ["node_modules/@types", "./types"], // 导入目录下所有的声明至全局空间
    "types": ["node", "moment"], // 导入node_modules文件夹下的@types/node和@types/moment，其他包将会被忽略
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2017",
    "sourceMap": true,
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false, // null 和 undefined 不再是任意类型的子类型，设置 null 和 undefined 设置类型
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "resolveJsonModule": true,
    "allowJs": true,
    "noFallthroughCasesInSwitch": false
  },
  "files": ["src"], // 哪些文件需要编译
  "include": ["../../global.d.ts", "**/*.ts", "**/*.tsx", "*.tsx", "*.ts"], // 哪些文件需要编译，支持模式匹配
  "exclude": [] // 排除
}
```

### 类型文件

- .d.ts
- global declaration：可以通过 typeRoots 和 types 编译选项设置
