# PHP 基础

**PHP，即"PHP: Hypertext Preprocessor"，是一种被广泛应用的开源通用脚本语言，尤其适用于 Web 开发并可嵌入 HTML 中去。**

- 服务端脚本。这是 PHP 最传统，也是最主要的目标领域。开展这项工作需要具备以下三点：PHP 解析器（CGI 或者服务器模块）、web 服务器和 web 浏览器。需要在运行 web 服务器时，安装并配置 PHP，然后，可以用 web 浏览器来访问 PHP 程序的输出，即浏览服务端的 PHP 页面。如果只是实验 PHP 编程，所有的这些都可以运行在自己家里的电脑中。请查阅[安装](mk:@MSITStore:E:\study\php\php_enhanced_zh.chm::/res/install.html)一章以获取更多信息。
- 命令行脚本。可以编写一段 PHP 脚本，并且不需要任何服务器或者浏览器来运行它。通过这种方式，仅仅只需要 PHP 解析器来执行。这种用法对于依赖 cron（Unix 或者 Linux 环境）或者 Task Scheduler（Windows 环境）的日常运行的脚本来说是理想的选择。这些脚本也可以用来处理简单的文本。请参阅 [PHP 的命令行模式](mk:@MSITStore:E:\study\php\php_enhanced_zh.chm::/res/features.commandline.html)以获取更多信息。
- 编写桌面应用程序。对于有着图形界面的桌面应用程序来说，PHP 或许不是一种最好的语言，但是如果用户非常精通 PHP，并且希望在客户端应用程序中使用 PHP 的一些高级特性，可以利用 PHP-GTK 来编写这些程序。用这种方法，还可以编写跨平台的应用程序。PHP-GTK 是 PHP 的一个扩展，在通常发布的 PHP 包中并不包含它。如果对 PHP-GTK 感兴趣，请访问其[» 网站](http://gtk.php.net/)以获取更多信息。

关于换行: 尽管换行在 HTML 中的实际意义不是很大，但适当地使用换行可以使 HTML 代码易读且美观。PHP 会在输出时自动删除其结束符 ?> 后的一个换行。该功能主要是针对在一个页面中嵌入多段 PHP 代码或者包含了无实质性输出的 PHP 文件而设计，与此同时也造成了一些疑惑。如果需要在 PHP 结束符 ?> 之后输出换行的话，可以在其后加一个空格，或者在最后的一个 echo/print 语句中加入一个换行。

## 基本语法

当解析一个文件时，PHP 会寻找起始和结束标记，也就是 `<?php 和 ?>`，这告诉 PHP 开始和停止解析二者之间的代码

如果文件内容是纯 PHP 代码，最好在文件末尾删除 PHP 结束标记。这可以避免在 PHP 结束标记之后万一意外加入了空格或者换行符，会导致 PHP 开始输出这些空白，而脚本中此时并无输出的意图。

### 从 HTML 中分离

#### Example #1 使用条件的高级分离术

```php
<?php if ($expression == true): ?>
  This will show if the expression is true.
<?php else: ?>
  Otherwise this will show.
<?php endif; ?>
```

上例中 PHP 将跳过条件语句未达成的段落，即使该段落位于 PHP 开始和结束标记之外。由于 PHP 解释器会在条件未达成时直接跳过该段条件语句块，因此 PHP 会根据条件来忽略之。

要输出大段文本时，跳出 PHP 解析模式通常比将文本通过 echo 或 print 输出更有效率。

可以在 PHP 中使用四对不同的开始和结束标记。其中两种，`<?php ?>` 和 `<script language="php"> </script>` 总是可用的。另两种是短标记和 ASP 风格标记，可以在 php.ini 配置文件中打开或关闭。尽管有些人觉得短标记和 ASP 风格标记很方便，但移植性较差，通常不推荐使用。

Note: _此外注意如果将 PHP 嵌入到 XML 或 XHTML 中则需要使用 `<?php ?>` 标记以保持符合标准。_

#### Example #2 PHP 开始和结束标记

```php
//1.
<?php echo 'if you want to serve XHTML or XML documents, do it like this'; ?>

//2.
<script language="php">
    echo 'some editors (like FrontPage) don\'t like processing instructions';
</script>

//3.
<? echo 'this is the simplest, an SGML processing instruction'; ?>
    <?= expression ?> This is a shortcut for "<? echo expression ?>"

//4.
<% echo 'You may optionally use ASP-style tags'; %>
<%= $variable; # This is a shortcut for "<% echo . . ." %>
```

上例中的 1 和 2 中使用的标记总是可用的，其中示例 1 中是最常用，并建议使用的。

短标记（上例 3）仅在通过 php.ini 配置文件中的指令 short_open_tag 打开后才可用，或者在 PHP 编译时加入了 --enable-short-tags 选项。

ASP 风格标记（上例 4）仅在通过 php.ini 配置文件中的指令 asp_tags 打开后才可用。

Note:_在以下情况应避免使用短标记：开发需要再次发布的程序或者库，或者在用户不能控制的服务器上开发。因为目标服务器可能不支持短标记。为了代码的移植及发行，确保不要使用短标记。_

Note: 在 PHP 5.2 和之前的版本中，解释器不允许一个文件的全部内容就是一个开始标记 <?php。自 PHP 5.3 起则允许此种文件，但要开始标记后有一个或更多白空格符。

Note: 自 PHP 5.4 起，短格式的 echo 标记 <?= 总会被识别并且合法，而不管 short_open_tag 的设置是什么。

#### 指令分隔符

PHP 需要在每个语句后用分号结束指令

#### 注释

```php
//单行注释

/*
    多行注释
*/
```

#### 引入文件

include "";

require '"";

require 一个文件存在错误的话，那么程序就会中断执行了，并显示致命错误
include 一个文件存在错误的话，那么程序不会中端，而是继续执行，并显示一个警告错误。

include 有返回值，而 require 没有。

有的文件不允许被包含多次?可以用\_once 来控制,

## 变量

### 可变变量

一个变量的值是一个变量的名

```php
$a="hello";
$hello="world";
echo $$a;//"world
```

### 超全局变量

1. `$_GET` //获取地址栏传值
2. `$_POST`//获取表单 method=post 传值
3. `$_COOKIE` //会话的一种，将信息保存在客户端
4. `$_SESSION` //会话的一种，将信息保存在服务器端
5. `$_FILE` // 获取上传文件的相关信息

## 数据类型

PHP 支持 9 种原始数据类型。

四种标量类型：
• boolean（布尔型）
• integer（整型）
• float（浮点型，也称作 double)
• string（字符串）

三种复合类型：
• array（数组）
• object（对象）
• callable（可调用）

最后是两种特殊类型：
• resource（资源）
• NULL（无类型）

Note: _如果想查看某个表达式的值和类型，用 var_dump() 函数。如果只是想得到一个易读懂的类型的表达方式用于调试，用 gettype() 函数。要检验某个类型，不要用 gettype()，而用 is_type 函数。如果要将一个变量强制转换为某类型，可以对其使用强制转换或者 settype() 函数。_

常量：常量不允许重复定义
Define(key,value);
Const key=value;

扩展：错误抑制符@

isset(变量)：变量是否设置
empty()：变量是否为空（0，"0",）

### Boolean 布尔类型

true 或 false(大小写不敏感)

要明确地将一个值转换成 boolean，用 (bool) 或者 (boolean) 来强制转换。但是很多情况下不需要用强制转换，因为当运算符，函数或者流程控制结构需要一个 boolean 参数时，该值会被自动转换。

当转换为 boolean 时，以下值被认为是 FALSE：
• 布尔值 FALSE 本身
• 整型值 0（零）
• 浮点型值 0.0（零）
• 空字符串，以及字符串 "0"
• 不包括任何元素的数组
• 特殊类型 NULL（包括尚未赋值的变量）
• 从空标记生成的 SimpleXML 对象

所有其它值都被认为是 TRUE（包括任何资源 和 NAN）。

### Integer 整型

整型值可以使用十进制，十六进制，八进制或二进制表示，前面可以加上可选的符号（- 或者 +）。

要使用八进制表达，数字前必须加上 0（零）。要使用十六进制表达，数字前必须加上 0x。要使用二进制表达，数字前必须加上 0b。

```php
<?php
$a = 1234; // 十进制数
$a = -123; // 负数
$a = 0123; // 八进制数 (等于十进制 83)
$a = 0x1A; // 十六进制数 (等于十进制 26)
$a = 0b11111111; // 二进制数字 (等于十进制 255)
?>
```

1. 转换为整型：要明确地将一个值转换为 integer，用 (int) 或 (integer) 强制转换。不过大多数情况下都不需要强制转换，因为当运算符，函数或流程控制需要一个 integer 参数时，值会自动转换。还可以通过函数 intval() 来将一个值转换成整型。
2. 将 resource 转换成 integer 时， 结果会是 PHP 运行时为 resource 分配的唯一资源号。
3. 从浮点型转换:当从浮点数转换成整数时，将向下取整。

Note: PHP 7.0.0 起，NaN 和 Infinity 在转换成 integer 时，不再是 undefined 或者依赖于平台，而是都会变成零。

```php
<?php
echo (int) ( (0.1+0.7) * 10 ); // 显示 7!
?>
```

### Float 浮点型

浮点数的精度:浮点数的精度有限。尽管取决于系统，PHP 通常使用 IEEE 754 双精度格式，则由于取整而导致的最大相对误差为 1.11e-16。非基本数学运算可能会给出更大误差，并且要考虑到进行复合运算时的误差传递。

比较浮点数

如上述警告信息所言，由于内部表达方式的原因，比较两个浮点数是否相等是有问题的。不过还是有迂回的方法来比较浮点数值的。

要测试浮点数是否相等，要使用一个仅比该数值大一丁点的最小误差值。该值也被称为机器极小值（epsilon）或最小单元取整数，是计算中所能接受的最小的差别值。

$a 和 $b 在小数点后五位精度内都是相等的。

```php
<?php
$a = 1.23456789;
$b = 1.23456780;
$epsilon = 0.00001;

if(abs($a-$b) < $epsilon) {
    echo "true";
}
?>
```

### String 字符串

#### 单引号

要表达一个单引号自身，需在它的前面加个反斜线（\）来转义。要表达一个反斜线自身，则用两个反斜线（\\）。其它任何方式的反斜线都会被当成反斜线本身：也就是说如果想使用其它转义序列例如 \r 或者 \n，并不代表任何特殊含义，就单纯是这两个字符本身。

Note: _不像双引号和 heredoc 语法结构，在单引号字符串中的变量和特殊字符的转义序列将不会被替换。_

#### 双引号

如果字符串是包围在双引号（"）中， PHP 将对一些特殊的字符进行解析：

序列 含义
\n 换行（ASCII 字符集中的 LF 或 0x0A (10)）
\r 回车（ASCII 字符集中的 CR 或 0x0D (13)）
\t 水平制表符（ASCII 字符集中的 HT 或 0x09 (9)）
\v 垂直制表符（ASCII 字符集中的 VT 或 0x0B (11)）（自 PHP 5.2.5 起）
\e Escape（ASCII 字符集中的 ESC 或 0x1B (27)）（自 PHP 5.4.0 起）
\f 换页（ASCII 字符集中的 FF 或 0x0C (12)）（自 PHP 5.2.5 起）
\\ 反斜线
\$ 美元标记
\" 双引号
\[0-7]{1,3} 符合该正则表达式序列的是一个以八进制方式来表达的字符
\x[0-9A-Fa-f] {1,2} 符合该正则表达式序列的是一个以十六进制方式来表达的字符

#### Heredoc 结构(<<<)

第三种表达字符串的方法是用 heredoc 句法结构：<<<。在该运算符之后要提供一个标识符，然后换行。接下来是字符串 string 本身，最后要用前面定义的标识符作为结束标志。

Heredoc 结构就象是没有使用双引号的双引号字符串，这就是说在 heredoc 结构中单引号不用被转义，但是上文中列出的转义序列还可以使用。变量将被替换，但在 heredoc 结构中含有复杂的变量时要格外小心。

要注意的是结束标识符这行除了可能有一个分号（;）外，绝对不能包含其它字符。这意味着标识符不能缩进，分号的前后也不能有任何空白或制表符。更重要的是结束标识符的前面必须是个被本地操作系统认可的换行，比如在 UNIX 和 Mac OS X 系统中是 \n，而结束定界符（可能其后有个分号）之后也必须紧跟一个换行。

如果不遵守该规则导致结束标识不"干净"，PHP 将认为它不是结束标识符而继续寻找。如果在文件结束前也没有找到一个正确的结束标识符，PHP 将会在最后一行产生一个解析错误。

#### 复杂（花括号）语法

复杂语法不是因为其语法复杂而得名，而是因为它可以使用复杂的表达式。

任何具有 string 表达的标量变量，数组单元或对象属性都可使用此语法。只需简单地像在 string 以外的地方那样写出表达式，然后用花括号 { 和 } 把它括起来即可。由于 { 无法被转义，只有 $ 紧挨着 { 时才会被识别。可以用 {\$ 来表达 {$。下面的示例可以更好的解释：

在双引号字符串中，使用{}将变量括起来可保证变量被顺利解析。

#### Nowdoc 结构

可理解为 Heredoc 结构(<<<)的不解析转义和变量版

```php
$str = <<<'EOD'
Example of string
spanning multiple lines
using nowdoc syntax.
EOD;
```

#### 方法

1. '.':连接字符串（'+'（加号）运算符没有这个功能）
2. str(index):下标访问字符串中的某个字符（要注意各字符编码占用的长度，用 [] 或 {} 访问任何其它类型（不包括数组或具有相应接口的对象实现）的变量只会无声地返回 NULL。 ）
3. (string) 或用 strval():转换为字符串
   1. boolean 的 TRUE 被转换成 string 的 "1"。Boolean 的 FALSE 被转换成 ""（空字符串）。
   2. 一个整数 integer 或浮点数 float 被转换为数字的字面样式的 string（包括 float 中的指数部分）。使用指数计数法的浮点数（4.1E+6）也可转换。
   3. 数组 array 总是转换成字符串 "Array"，因此，echo 和 print 无法显示出该数组的内容。要显示某个单元，可以用 echo $arr['foo'] 这种结构
   4. NULL 总是被转变成空字符串
   5. 资源 resource 总会被转变成 "Resource id #1" 这种结构的字符串

某些函数假定字符串是以单字节编码的:

1. substr(string $string , int $start [, int $length ]): start 是负数，返回的字符串将从 string 结尾处向前数第 start 个字符开始。如果 string 的长度小于 start，将返回 FALSE。
2. mb_substr(string $str , int $start [, int $length = NULL [, string $encoding = mb_internal_encoding()]]);

   - $string 从哪个字符串中截取
   - $start 从字符串哪个地方开始截
   - $length 截取多长，---如果没有这个参数，会从开始截取的地方一直截取到最后
   - $encoding 当前的编码（文件编码）

3. strpos(string $haystack , mixed $needle [, int $offset = 0 ]):字符串中查找某一段字符串
4. strrpos()：和 strpos 使用的方式一样，只不过返回的是最后一次出现的位置
5. strlen():获取字符串长度,如果 string 为空，则返回 0。
6. strcmp(string $str1 , string $str2):如果 str1 小于 str2 返回 < 0； 如果 str1 大于 str2 返回 > 0；如果两者相等，返回 0。

7. implode(string $glue , array $pieces) 数组转换成字符串
8. explode ( string $delimiter , string $string [, int $limit ] )
   - $delimiter 用什么字符来分割需要转换成数组的字符串
   - $string 需要转化成数组的字符串
9. str_split(string $string [, int $split_length = 1 ]):字符串按照字符个数来转换成数组，如果最后一个元素不够指定的数目，也会当成一个数组元素
10. strtolower();strtoupper();ucfirst():把字符串中第一个字符转换成大写
11. str_replace ( mixed $search , mixed $replace , mixed $subject)
    - $search:被替换的字符串
    - $replace:用什么字符串替换
    - $subject:在哪个字符串中进行替换
12. trim()---去掉左边和右边的空格及/n、/t 等转义字符
13. ltrim()---去掉左边的空格及/n、/t 等转义字符
14. rtrim()----去掉右边的空格及/n、/t 等转义字符
15. str_repeat(string $input,int $multiplier);字符串重复
    - $string 被重复的字符串
    - $multiplier 重复的次数
16. string str_shuffle ( string $str);$string 需要被打乱的字符串

#### 字符串转换为数值

当一个字符串被当作一个数值来取值，其结果和类型如下：

如果该字符串没有包含 '.'，'e' 或 'E' 并且其数字值在整型的范围之内（由 PHP_INT_MAX 所定义），该字符串将被当成 integer 来取值。其它所有情况下都被作为 float 来取值。

该字符串的开始部分决定了它的值。如果该字符串以合法的数值开始，则使用该数值。否则其值为 0（零）。合法数值由可选的正负号，后面跟着一个或多个数字（可能有小数点），再跟着可选的指数部分。指数部分由 'e' 或 'E' 后面跟着一个或多个数字构成。

```php
<?php
$foo = 1 + "10.5";                // $foo is float (11.5)
$foo = 1 + "-1.3e3";              // $foo is float (-1299)
$foo = 1 + "bob-1.3e3";           // $foo is integer (1)
$foo = 1 + "bob3";                // $foo is integer (1)
$foo = 1 + "10 Small Pigs";       // $foo is integer (11)
$foo = 4 + "10.2 Little Piggies"; // $foo is float (14.2)
$foo = "10.0 pigs " + 1;          // $foo is float (11)
$foo = "10.0 pigs " + 1.0;        // $foo is float (11)
?>
```

### Array 数组

PHP 中的数组实际上是一个有序映射。映射是一种把 values 关联到 keys 的类型。

关联数组:就是下标是字符串的数组
枚举数组索引数组:就是下标是数字的数组

PHP 数组可以同时含有 integer 和 string 类型的键名，因为 PHP 实际并不区分索引数组和关联数组。

#### 定义

1. array()：它接受任意数量用逗号分隔的 键（key） => 值（value）对。
   - // 键（key）可是是一个整数 integer 或字符串 string
   - // 值（value）可以是任意类型的值
2. []

```php
<?php
$array = array(
    "foo" => "bar",
    "bar" => "foo",
);

// 自 PHP 5.4 起
$array = [
    "foo" => "bar",
    "bar" => "foo",
];
?>
```

key 会有如下的强制转换：

• 包含有合法整型值的字符串会被转换为整型。例如键名 "8" 实际会被储存为 8。但是 "08" 则不会强制转换，因为其不是一个合法的十进制数值。
• 浮点数也会被转换为整型，意味着其小数部分会被舍去。例如键名 8.7 实际会被储存为 8。
• 布尔值也会被转换成整型。即键名 true 实际会被储存为 1 而键名 false 会被储存为 0。
• Null 会被转换为空字符串，即键名 null 实际会被储存为 ""。
• 数组和对象不能被用为键名。坚持这么做会导致警告：Illegal offset type。

如果在数组定义中多个单元都使用了同一个键名，则只使用了最后一个，之前的都被覆盖了。

如果不给键名，则默认 1，2，3，4，5，...

数组单元可以通过 array[key] 语法来访问

数组元素的顺序以放入顺序为准，跟下标无关

#### 数组方法

```php
foreach ($arr as $key=>$value)
{

}
//如不需要循环下标
foreach ($arr as $value)
{

}


//遍历数组的第三种方法
while(list($key,$val)=each($arr)){
    echo $key.':'.$val."<br>";
}
```

`$key`代表当前元素的下标
`$value`代表当前元素的值

指针函数，比如：
reset(), ---------移动指针到第一个元素
end(), -------移动指针到最后一个元素

key()-----------指针指向的当前元素的下标
current(), ----指针指向的当前元素的值

sort(), ----从低到高来排序
rsort(), ----从高到底排序

asort(), 保持索引关系正向排序
arsort(), 保持索引关系逆向排序

ksort(), 按照下标来正向排序
krsort(), 按照下标逆向排序

shuffle() 打乱数组的元素顺序，这里是随机打乱的

count() ---返回数组中元素的个数
array_push() ----想数组中追加元素，可以同时追加多个元素
array_pop(),-----删除数组中最后一个加入的元素

array_reverse()----反转数组
in_array(), ----判断数组中是否包含某个值
array_keys(),----返回数组中所有的下标
array_values()-----返回数组中所有的值

## 数据库操作

### 连接数据库

1. 创建连接接口：$conn = mysqli_connect('请求地址','用户名','用户密码','数据库名');
2. 执行语句：`mysqli_query($conn,$sql语句);`
   1. 查询语句（SELECT）会返回一个阅读器或者 false
   2. 其他语句如 delete，insert into，update 等会根据执行结果返回 true 或 false
3. 如果获得的是阅读器`$reader`，则根据需求的数据，使用
   1. mysqli_fetch_row：返回索引数组
   2. mysqli_fetch_assoc：返回关联数组
4. 获取数据完毕，关闭阅读器：`mysqli_free_request($reader)`
5. 关闭连接数据：`mysqli_close($conn)`

### 操作数据库

// 基本的 sql 语句

// 增加
// INSERT INTO 表名 ( 列名, 列名, ... ) VALUES ( 值, 值, ... );
// 不好的习惯: INSERT 表名 VALUES ( 值, 值, ... );

// 删除
// DELETE FROM 表名 WHERE 条件

// 修改
// UPDATE 表名 SET 列 = 值, 列 = 值, ... WHERE 条件

// 看文档的时候, 文档描述语法
// UPDATE 表名 SET 列=值[, 列=值] ...
// UPDATE 表名 SET {列=值} , ...

// 查询
// SELECT 列[, 列] ... FROM 表名 WHERE 条件

// SELECT { 列[, 列] ... | \* } FROM 表名 WHERE 条件

// ORDER BY 列名 DESC

// LIMIT offset, count

## header

### content-type

根据 content-type : jquery 的 ajax 可以根据返回的数据正确的识别数据类型

//定义编码  
header( 'Content-Type:text/html;charset=utf-8 ');

//Atom  
header('Content-type: application/atom+xml');

//CSS  
header('Content-type: text/css');

//Javascript  
 header('Content-type: text/javascript');

//JPEG Image  
 header('Content-type: image/jpeg');

//JSON  
 header('Content-type: application/json');

//PDF  
 header('Content-type: application/pdf');

//RSS  
 header('Content-Type: application/rss+xml; charset=ISO-8859-1');

//Text (Plain)  
 header('Content-type: text/plain');

//XML  
 header('Content-type: text/xml');

// ok  
 header('HTTP/1.1 200 OK');

//设置一个 404 头:  
 header('HTTP/1.1 404 Not Found');

//设置地址被永久的重定向  
 header('HTTP/1.1 301 Moved Permanently');

//转到一个新地址  
 header('Location: http://www.example.org/');

//文件延迟转向:  
 header('Refresh: 10; url=http://www.example.org/');  
 print 'You will be redirected in 10 seconds';

//当然，也可以使用 html 语法实现  
 // <meta http-equiv="refresh" content="10;http://www.example.org/ />

// override X-Powered-By: PHP:  
 header('X-Powered-By: PHP/4.4.0');  
 header('X-Powered-By: Brain/0.6b');

//文档语言  
 header('Content-language: en');

//告诉浏览器最后一次修改时间  
 $time = time() - 60; // or filemtime($fn), etc  
 header('Last-Modified: '.gmdate('D, d M Y H:i:s', $time).' GMT');

//告诉浏览器文档内容没有发生改变  
 header('HTTP/1.1 304 Not Modified');

//设置内容长度  
 header('Content-Length: 1234');

//设置为一个下载类型  
 header('Content-Type: application/octet-stream');  
 header('Content-Disposition: attachment; filename="example.zip"');  
 header('Content-Transfer-Encoding: binary');  
 // load the file to send:  
 readfile('example.zip');

// 对当前文档禁用缓存  
 header('Cache-Control: no-cache, no-store, max-age=0, must-revalidate');  
 header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past  
 header('Pragma: no-cache');

//设置内容类型:  
 header('Content-Type: text/html; charset=iso-8859-1');  
 header('Content-Type: text/html; charset=utf-8');  
 header('Content-Type: text/plain'); //纯文本格式  
 header('Content-Type: image/jpeg'); //JPG**\*  
 header('Content-Type: application/zip'); // ZIP 文件  
 header('Content-Type: application/pdf'); // PDF 文件  
 header('Content-Type: audio/mpeg'); // 音频文件  
 header('Content-Type: application/x-shockw**e-flash'); //Flash 动画

//显示登陆对话框  
 header('HTTP/1.1 401 Unauthorized');  
 header('WWW-Authenticate: Basic realm="Top Secret"');  
 print 'Text that will be displayed if the user hits cancel or ';  
 print 'enters wrong login data';

## composer

### Linux/Mac：

```shell
wget https://dl.laravel-china.org/composer.phar -O /usr/local/bin/composer
chmod a+x /usr/local/bin/composer
```

如遇权限不足，可添加 `sudo`。

### Windows：

1. 直接下载 composer.phar，地址：<https://dl.laravel-china.org/composer.phar>
2. 把下载的 composer.phar 放到 PHP 安装目录
3. 新建 composer.bat, 添加如下内容，并保存：

```shell
@php "%~dp0composer.phar" %*
```

### 查看当前版本

```shell
composer -V
```

### 升级版本

```shell
composer selfupdate
```

> 注意 `selfupdate` 升级命令会连接官方服务器，速度很慢。建议直接下载我们的 `composer.phar` 镜像，每天都会更新到最新。

### 遇到问题？

`composer` 命令后面加上 -vvv （是 3 个 v）可以打印出调错信息，命令如下：

```shell
composer -vvv create-project laravel/laravel blog
composer -vvv require psr/log
```

如果自己解决不了，或发现 BUG，可以在 [@扣丁禅师](https://laravel-china.org/users/12063) 的 GitHub 上 [创建 Issue](https://github.com/zencodex/composer/issues/new)。

注意提问时请带上 -vvv 的输出，并且要求叙述清晰，第一次提问的同学请阅读 [关于提问的智慧](https://laravel-china.org/topics/2396/wisdom-of-asking-questions-chinese-version)。

## Laravel

### 动态创建 Monogo 数据库链接

一般 Laravel 切换数据库链接只能在 config/database.php 中写好再调用，但如果数据库名不确定该如何动态创建呢？

```php
<?php

namespace App\Utils;

use MongoDB\Client;
use Symfony\Component\VarDumper\VarDumper;

$url = 'mongodb://127.0.0.1/';

class Mongo
{
        static function find(string $url = 'mongodb://127.0.0.1/', string $database, string $collection) {
                $collection = self::connect($url, $database, $collection);
                $res = $collection->find();
                if (!$res || is_array($res)) {
                        return [];
                }

        $res = $res->toArray();
        foreach ($res as &$ele) {
                if (!$ele) {
                        continue;
                }
                $ele = (array)$ele;
        }
        return $res;
        }

        private static function connect(string $url, string $database, string $collection) {
                $client=new Client($url);
                $db=$client->selectDatabase($database);
                $collection=$db->selectCollection($collection);
                return $collection;
        }
}
```

### 日志权限

有时候 laravel 会出现无权限写日志的问题，我们可以按以下步骤去检查：

运行 laravel 的 php-fpm 是什么用户，一般是 www，最好不要使用 root。
应用目录中，storage/logs 有没有写权限。
是否有运行 laravel 的脚本或者 crontab，或者 supervisor，并且运行的用户和 php-fpm 的是一样的，一般是 www。如果以其他身份（例如 root）运行的时候 laravel 需要写日志并且创建了日志文件，那这个日志文件是属于其他用户的，www 用户无法写入。
解决办法

修改 php-fpm 的配置文件，修改 user 和 group 为 www。
chmod a+w storage/logs
运行 php artisan 时 su www &，crontab 添加执行用户 \* www command

日志权限的问题基本是出现在有使用 artisan 执行定时任务的情况下。查看日志文件的权限时发现，处理 Web 请求时的日志的用户为 nobody。

```php
$ ls -l
total 12508
-rw-r--r-- 1 nobody nobody    67680 Jan 14 23:59 laravel-2018-01-14.log
-rw-r--r-- 1 nobody nobody    74680 Jan 15 23:59 laravel-2018-01-15.log
-rw-r--r-- 1 nobody nobody    74680 Jan 16 23:59 laravel-2018-01-16.log
```

后来查了一下，使用 crontab 执行定时任务时，默认用户是 root，root 用户生成的文件，nobody 用户自然没有权限进行处理，出问题也就不奇怪了。又查了一下，使用 crontab 编辑定时任务列表的时候，是可以指定用户的，默认是编辑 root 用户的任务列表。

> 执行 `crontab -e` 的时候添加 `-u` 选项，并追加相应的用户名，就可以为指定的用户编辑定时任务列表。

```php
$ crontab -u nobody -e

* * * * * edit the command you want to execute for user nobody
```

> 执行 `crontab -u nobody -l` 选项可以查看 nobody 用户的任务列表。

```php
$ crontab -u nobody -l

* * * * * command one for user nobody
* * * * * command two for user nobody
```
