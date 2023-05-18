# AST

## AST 基本结构

AST 由很多 node 组成，每个 node 的结构类似：

```js
node = {
  type: String,
  id: Object,
  params,
  body,
}
```

node 的公共 interface：

```js
interface Node {
  type: string;
}
```

- type：字符串，代表当前 node 的类型
  - FunctionDeclaration
  - Identifier
  - BinaryExpression
  - CommentLine
  - File
  - Program

### babel 生成的 AST 结构

babel 的 AST node 会多一些描述源码位置的额外属性（start、end、loc）

```
{
  type: ...,
  start: 0, // 代码开始位置，换行符算1位置
  end: 38, // 代码结束位置
  loc: {
    start: {
      line: 1,
      column: 0
    },
    end: {
      line: 3,
      column: 1
    }
  },
  ...
}
```

## 步骤

### Parse

将源码转换成 AST。babel 会进行词法分析（[Lexical Analysis](https://en.wikipedia.org/wiki/Lexical_analysis) 和语法分析([Syntactic Analysis](https://en.wikipedia.org/wiki/Parsing)) 两个步骤。

词法分析将代码 token 化，语法分析将代码 tokens 流转化成 AST 表述。最终的 AST 可以代表源代码的结构。

### Transform

遍历 AST 时添加、更新、删除 AST 节点。这是大部分编译器中最复杂的部分。babel 插件的在此过程中生效。

#### Traversal

转换 AST 树需要遍历整个树

进入节点时：

```js
const MyVisitor = {
  Identifier: {
    enter() {
      console.log("Called!");
    },
  },
};
// 可简写成：
const MyVisitorSimple = {
  Identifier() {
    console.log("Called!");
  },
};
```

离开节点

```js
const MyVisitor = {
  Identifier: {
    enter() {
      console.log("Entered!");
    },
    exit() {
      console.log("Exited!");
    },
  },
};
```

可以用`|`进行多个访问节点使用同一个方法:

```js
const MyVisitor = {
  "ExportNamedDeclaration|Flow": function(path) {
    // do ...
  },
};
```

也可以使用别名：

Function 代表 FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, ObjectMethod and ClassMethod

#### Paths

path 代表节点间的纽带

```js
const MyVisitor = {
  Identifier(path) {
    console.log(`Visiting: ${  path.node.name}`);
  },
};
```

改变函数变量名

```js
const updateParamNameVisitor = {
  Identifier(path) {
    if (path.node.name === this.paramsName) path.node.name = "x";
  },
};
const visitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    const paramName = param.name;
    param.name = "x";

    path.traverse(updateParamNameVisitor, { paramName });
  },
};
```

#### scope 作用域

修改 node 时需要注意原有代码的作用域，

作用域结构类似：

```js
const scope = {
  path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: []
}
```

#### Bindings

Bindings 代表了引用归属哪个作用域（scope）

Bindings 结构类似：

```js
const Bindings = {
  identifier: node,
  scope,
  path,
  kind: 'var',

  referenced: true,
  references: 3,
  referencePaths: [path, path, path],

  constant: false,
  constantViolations: [path]
}
```

### Generate

将 AST 转换回代码，并生成 [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)。

## API

### babel-parser

对 Acorn 的 fork。

```js
// npm install --save @babel/parser

import parser from "@babel/parser";

const code = `function square(n) {
  return n * n;
}`;

parser.parse(code);
// Node {
//   type: "File",
//   start: 0,
//   end: 38,
//   loc: SourceLocation {...},
//   program: Node {...},
//   comments: [],
//   tokens: [...]
// }
```

选项

```js
parser.parse(code, {
  sourceType: "module", // default: "script"  "module" or "script"   "module" will parse in strict mode and allow module declarations, "script" will not.
  plugins: ["jsx"], // default: [] 暂时不支持第三方扩展
});
```

### babel-traverse

```js
// npm install --save @babel/traverse
import parser from "@babel/parser";
import traverse from "@babel/traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
  enter(path) {
    if (path.node.type === "Identifier" && path.node.name === "n") {
      path.node.name = "x";
    }
  },
});
```

### babel-types

lodash 式的 AST node 方法库，包含了构建、校验、转换

```js
// npm install --save @babel/types
import traverse from "@babel/traverse";
import types from "@babel/types";

traverse(ast, {
  enter(path) {
    if (types.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  },
});
```

#### Definitions

单个节点类型定义类似：

```js
defineType("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: assertValueType("string"),
    },
    left: {
      validate: assertNodeType("Expression"),
    },
    right: {
      validate: assertNodeType("Expression"),
    },
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"],
});
```

#### Builders

BinaryExpression 定义拥有 builder

```js
// builder: ["operator", "left", "right"]

t.binaryExpression("*", t.identifier("a"), t.identifier("b"));

// 会生成一下 AST
const Builders = {
  type: "BinaryExpression",
  operator: "*",
  left: {
    type: "Identifier",
    name: "a"
  },
  right: {
    type: "Identifier",
    name: "b"
  }
}
```

#### 校验

```js
fields = {
  operator: {
    validate: assertValueType("string")
  },
  left: {
    validate: assertNodeType("Expression")
  },
  right: {
    validate: assertNodeType("Expression")
  }
}
```

#### 构建节点

构建节点的方法就是类型声明的首字母小写，参数依据[节点声明](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions)

类型声明类似：

```js
defineType("MemberExpression", {
  builder: ["object", "property", "computed"], // 需要的参数
  visitor: ["object", "property"],
  aliases: ["Expression", "LVal"],
  fields: {
    object: {
      validate: assertNodeType("Expression"),
    },
    property: {
      validate(node, key, val) {
        const expectedType = node.computed ? "Expression" : "Identifier";
        assertNodeType(expectedType)(node, key, val);
      },
    },
    computed: {
      default: false,
    },
  },
});
```

构建 node

```
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` is optional
);
// object.property
```

### replaceWith 替换单个节点

```
BinaryExpression(path) {
  path.replaceWith(
    t.binaryExpression("**", path.node.left, t.numberLiteral(2))
  );
}
  function square(n) {
-   return n * n;
+   return n ** 2;
  }
```

### replaceWithMultiple 替换为多节点

```
ReturnStatement(path) {
  path.replaceWithMultiple([
    t.expressionStatement(t.stringLiteral("Is this the real life?")),
    t.expressionStatement(t.stringLiteral("Is this just fantasy?")),
    t.expressionStatement(t.stringLiteral("(Enjoy singing the rest of the song in your head)")),
  ]);
}
  function square(n) {
-   return n * n;
+   "Is this the real life?";
+   "Is this just fantasy?";
+   "(Enjoy singing the rest of the song in your head)";
  }
```

替换多个节点时，每个节点必须是表达式，

### replaceWithSourceString 替换为字符串源码

```
FunctionDeclaration(path) {
  path.replaceWithSourceString(`function add(a, b) {
    return a + b;
  }`);
}
- function square(n) {
-   return n * n;
+ function add(a, b) {
+   return a + b;
  }
```

> 除非在处理动态字符串，否则不要使用该 api

### 插入数组 insertBefore`/`insertAfter

```
ClassMethod(path) {
  path.get('body').unshiftContainer('body', t.expressionStatement(t.stringLiteral('before')));
  path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after')));
}
```

```
 class A {
  constructor() {
+   "before"
    var a = 'middle';
+   "after"
  }
 }
```

### 删除节点

```
FunctionDeclaration(path) {
  path.remove();
}
```

```
- function square(n) {
-   return n * n;
- }
```

### 替换父节点

```
BinaryExpression(path) {
  path.parentPath.replaceWith(
    t.expressionStatement(t.stringLiteral("Anyway the wind blows, doesn't really matter to me, to me."))
  );
}
```

```
  function square(n) {
-   return n * n;
+   "Anyway the wind blows, doesn't really matter to me, to me.";
  }
```

### 检查变量

```
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

```
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### 生成 UID

```
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### 向父节点增加变量声明

```
FunctionDeclaration(path) {
  const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
  path.remove();
  path.scope.parent.push({ id, init: path.node });
}
```

```
- function square(n) {
+ var _square = function square(n) {
    return n * n;
- }
+ };
```

### 重命名绑定和引用

```
FunctionDeclaration(path) {
  path.scope.rename("n", "x");
}
```

```
- function square(n) {
-   return n * n;
+ function square(x) {
+   return x * x;
  }
```

或者自动生成唯一标识符

```
FunctionDeclaration(path) {
  path.scope.rename("n");
}
```

```
- function square(n) {
-   return n * n;
+ function square(_n) {
+   return _n * _n;
  }
```

### 获取节点、子节点

```
// the BinaryExpression AST node has properties: `left`, `right`, `operator`
BinaryExpression(path) {
  path.node.left;
  path.node.right;
  path.node.operator;
}
```

```
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body.0');
}
```

### babel-generator

```js
// npm install --save @babel/generator
import parser from "@babel/parser";
import generator from "@babel/generator";

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

generator(ast, {}, code);
// {
//   code: "...",
//   map: "..."
// }
```

## babel-types

- `assignmentExpression` 生成赋值表达式。"a = b.c"
- `memberExpression` 生成表达式 "a"、"a.b"
