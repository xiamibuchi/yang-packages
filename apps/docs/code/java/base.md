# Java 基础

1995 年，Java 发布。

1. 简单易学；
2. 面向对象（封装，继承，多态）；
3. 平台无关性（ Java 虚拟机实现平台无关性）；
4. 可靠性；
5. 安全性；
6. 支持多线程
7. 编译与解释并存；

## install

[Other download options for Red Hat build of OpenJDK](https://developers.redhat.com/products/openjdk/install)

### Mac

[Alternate versions of Casks](https://github.com/Homebrew/homebrew-cask-versions)

```zsh
# install the latest Temurin jdk
brew install --cask temurin

# install a specific java version
brew tap homebrew/cask-versions
brew install --cask temurin17
```

### linux

```shell
sudo yum install java-17-openjdk
java -version
```

## develop tools

IDE: [IDEA](https://www.jetbrains.com/idea/)

## JVM、JRE、JDK

- JVM 是运行 Java 字节码的虚拟机,JVM 可以理解的代码就叫做字节码（即扩展名为 .class 的文件。
- JDK 是 Java Development Kit 缩写，它是功能齐全的 Java SDK。它拥有 JRE 所拥有的一切，还有编译器（javac）和工具（如 javadoc 和 jdb）。它能够创建和编译程序。
- JRE 是 Java 运行时环境。它是运行已编译 Java 程序所需的所有内容的集合，包括 Java 虚拟机（JVM），Java 类库，java 命令和其他的一些基础构件。但是，它不能用于创建新程序。

## 编译与解释并存

高级编程语言按照程序的执行方式分为编译型和解释型两种。简单来说，编译型语言是指编译器针对特定的操作系统将源代码一次性翻译成可被该平台执行的机器码；解释型语言是指解释器对源程序逐行解释成特定平台的机器码并立即执行。比如，你想阅读一本英文名著，你可以找一个英文翻译人员帮助你阅读， 有两种选择方式，你可以先等翻译人员将全本的英文名著（也就是源码）都翻译成汉语，再去阅读，也可以让翻译人员翻译一段，你在旁边阅读一段，慢慢把书读完。

Java 语言既具有编译型语言的特征，也具有解释型语言的特征，因为 Java 程序要经过先编译，后解释两个步骤，由 Java 编写的程序需要先经过编译步骤，生成字节码（\*.class 文件），这种字节码必须由 Java 解释器来解释执行。因此，我们可以认为 Java 语言编译与解释并存。

## 注释

- 单行注释
- 多行注释
- 文档注释

```java
public class HelloWorld {
    /*
     * 文档注释
     */
    public static void main(String[] args) {
        // 单行注释
        /* 多行注释：
           1. 注意点a
           2. 注意点b
         */
        System.out.println("Hello World");
    }
}
```

## 变量

- 局部变量：类方法中的变量
  - 方法执行时创建，执行结束销毁
  - 没有默认值，所以必须经过初始化，才可以使用
  - 基本类型存储在栈；引用类型会把其对象存储在堆，而把这个对象的引用（指针）存储在栈
  - 访问修饰符不能用于局部变量
- 成员变量（实例变量）：类方法外的变量，没有 static 修饰
  - 对象创建时创建，对象销毁时销毁
  - 有默认值。数值型变量的默认值是 0，布尔型变量的默认值是 false，引用类型变量的默认值是 null
  - 变量的值可以在声明时指定，也可以在构造方法中指定
  - 实例变量存储在堆
  - 访问修饰符可以用于实例变量
- 类变量（静态变量）：类方法外的变量，用 static 修饰
  - 第一次被访问时创建，程序结束时销毁
  - 有默认值。数值型变量的默认值是 0，布尔型变量的默认值是 false，引用类型变量的默认值是 null
  - 变量的值可以在声明时指定，也可以在构造方法中指定，还可在静态语句块中初始化
  - 存储在静态存储
  - 访问修饰符可以用于类变量
  - 无论一个类创建了多少个对象，类只拥有类变量的一份拷贝
  - 除了被声明为常量外很少使用

### 变量修饰符

访问控制修饰符 : 如果变量是实例变量或类变量，可以添加访问级别修饰符（public/protected/private）
静态修饰符: 类变量，需要添加 static 修饰
final: 变量使用 final 修饰符，表示这是一个常量，不能被修改

```java
// 常量
final double PI = 3.1415927;
```

## 数据类型

| **数据类型**           | **默认值** |
| :--------------------- | :--------- |
| byte                   | 0          |
| short                  | 0          |
| int                    | 0          |
| long                   | 0L         |
| float                  | +0.0F      |
| double                 | +0.0D      |
| char                   | '\u0000'   |
| String (or any object) | null       |
| boolean                | false      |

## 枚举

```java
enum Size {BIG, MIDDLE, SMALL;}
for (Size s : Size.values()) {
    System.out.println(s + " name: " + s.name());
    System.out.println(s + " ordinal: " + s.ordinal());
    System.out.println(s.equals(Size.MIDDLE));
}
// BIG name: BIG
// BIG ordinal: 0
// false
// MIDDLE name: MIDDLE
// MIDDLE ordinal: 1
// true
// SMALL name: SMALL
// SMALL ordinal: 2
// false
```

## 泛型

JDK 5 引入，提供了编译时类型安全检测机制，该机制允许程序员在编译时检测到非法的类型。泛型的本质是参数化类型，也就是说所操作的数据类型被指定为一个参数。

> Java 的泛型是伪泛型，这是因为 Java 在编译期间，所有的泛型信息都会被擦掉，这也就是通常所说类型擦除。

```java
List<Integer> list = new ArrayList<>();

list.add(12);
//这里直接添加会报错
list.add("a");
Class<? extends List> clazz = list.getClass();
Method add = clazz.getDeclaredMethod("add", Object.class);
//但是通过反射添加，是可以的
add.invoke(list, "kl");

System.out.println(list)
```

常量名也可以用小写，但为了便于识别，通常使用大写字母表示常量

### byte

8 位、有符号的，以二进制补码表示的整数
最小值：`-128（-2^7）`
最大值：`127（2^7-1）`
默认值：`0`

byte 类型用在大型数组中节约空间，主要代替整数，因为 byte 变量占用的空间只有 int 类型的四分之一

`byte a = -50;`

### short

16 位、有符号的以二进制补码表示的整数

最小值：-32768（-2^15）
最大值：32767（2^15 - 1）
默认值：`0`

Short 数据类型也可以像 byte 那样节省空间。一个 short 变量是 int 型变量所占空间的二分之一

`short s = 1000，short r = -20000`

### int

32 位、有符号的以二进制补码表示的整数

最小值：`-2,147,483,648（-2^31）`
最大值：`2,147,483,647（2^31 - 1）`
默认值：`0`

一般整型变量默认为 int 类型

`int a = 100000;`

### long

64 位、有符号的以二进制补码表示的整数
最小值：`-9,223,372,036,854,775,808（-2^63）`
最大值：`9,223,372,036,854,775,807（2^63 -1）`
默认值：`0L`

主要使用在需要比较大整数的系统上

`long a = 100000L;`

"L"理论上不分大小写，但是若写成"l"容易与数字"1"混淆，不容易分辩。所以最好大写。

### float

单精度、32 位、符合 IEEE 754 标准的浮点数
float 在储存大型浮点数组的时候可节省内存空间
默认值是 `+0.0F `

浮点数不能用来表示精确的值，如货币

`float f1 = 234.5f;`

### double

双精度、64 位、符合 IEEE 754 标准的浮点数
浮点数的默认类型为 double 类型
double 类型同样不能表示精确的值，如货币
默认值：`+0.0D`
`double a = 123.4;`

### boolean

表示一位的信息
只有两个取值：true 和 false
这种类型只作为一种标志来记录 true/false 情况
默认值是 false
`boolean a = true;`

### char

char 类型是一个单一的 16 位 Unicode 字符
最小值是 \u0000（即为 0）
最大值是 \uffff（即为 65535）
char 数据类型可以储存任何字符
`char letter = 'A';`

> 字符串常量是双引号引起的 0 个或若干个字符，而 char 必须有单一字符

### BigInteger

Biglnteger add(Biglnteger other)
Biglnteger subtract(Biglnteger other)
Biglnteger multipiy(Biginteger other)
Biglnteger divide(Biglnteger other)
Biglnteger mod(Biglnteger other) // 余数
int compareTo(Biglnteger other) // 如果这个大整数与另一个大整数 other 相等， 返回 0; 如果这个大整数小于另一个大整数 other, 返回负数； 否则， 返回正数。
static Biglnteger valueOf(1ong x) //返回值等于 x 的大整数。

## 数组

```java
int list = new int[1000]; // 创建了一个可以存储 100 个整数的数组
int[] list = { 1, 2, 3 };
int list[] = { 4, 5, 6 };
```

```java
public class ArrayDemo {
    public static void main(String[] args) {
        int[] array = {1, 2, 3};
        for (int i = 0; i < array.length; i++) {
            array[i]++;
            System.out.println(String.format("array[%d] = %d", i, array[i]));
        }
    }
}

// array[0] = 2
// array[1] = 3
// array[2] = 4

// 多维数组
Integer[][] a = {
    {1, 2, 3 },
    {4, 5, 6 },
};
```

## 类型转换

1. 不能对 boolean 类型进行类型转换。
2. 不能把对象类型转换成不相关类的对象。
3. 在把容量大的类型转换为容量小的类型时必须使用强制类型转换。
4. 转换过程中可能导致溢出或损失精度:
   ```java
   int i =128;
   byte b = (byte)i; // 因为 byte 类型是 8 位，最大值为127，当 int 强制转换为 byte 类型时，就可能导致溢出
   ```
5. 浮点数到整数的转换是通过舍弃小数得到，而不是四舍五入

### 自动类型转换

必须满足转换前的数据类型的位数要低于转换后的数据类型，例如: short 数据类型的位数为 16 位，就可以自动转换位数为 32 的 int 类型，同样 float 数据类型的位数为 32，可以自动转换为 64 位的 double 类型。

```java
public class Test {
    public static void main(String[] args){
        char c1='a';//定义一个char类型
        int i1 = c1;//char自动类型转换为int
        System.out.println("char自动类型转换为int后的值等于"+i1);
        char c2 = 'A';//定义一个char类型
        int i2 = c2+1;//char 类型和 int 类型计算
        System.out.println("char类型和int计算后的值等于"+i2);
    }
}
```

### 强制类型转换

1. 条件是转换的数据类型必须是兼容的。
2. 格式：(type)value type 是要强制类型转换后的数据类型

```java
public class Test {
    public static void main(String[] args){
        int i1 = 123;
        byte b = (byte)i1;//强制类型转换为byte
        System.out.println("int强制类型转换为byte后的值等于"+b);
    }
}
```

### 数值类型间的转换

- 如果两个操作数中有一个是 double 类型， 另一个操作数就会转换为 double 类型。
- 否则， 如果其中一个操作数是 float 类型， 另一个操作数将会转换为 float 类型。
- 否则， 如果其中一个操作数是 long 类型， 另一个操作数将会转换为 long 类型。
- 否则， 两个操作数都将被转换为 int 类型。

## 引用类型

- 在 Java 中，引用类型的变量非常类似于 C/C++的指针。引用类型指向一个对象，指向对象的变量是引用变量。这些变量在声明时被指定为一个特定的类型，比如 Employee、Puppy 等。变量一旦声明后，类型就不能被改变了。
- 对象、数组都是引用数据类型。
- 所有引用类型的默认值都是 null。
- 一个引用变量可以用来引用任何与之兼容的类型。

## 变量

### 变量类型

- 类变量：独立于方法之外的变量，用 static 修饰。
- 实例变量：独立于方法之外的变量，不过没有 static 修饰。
- 局部变量：类的方法中的变量。

```java

 public class Variable{
 static int allClicks=0; // 类变量
    String str="hello world";  // 实例变量
    public void method(){
        int i =0;  // 局部变量
    }
}
```

## 修饰符

- **default** (即默认，什么也不写）: 在同一包内可见，不使用任何修饰符。使用对象：类、接口、变量、方法。
- **private** : 在同一类内可见。使用对象：变量、方法。 **注意：不能修饰类（外部类）**
- **public** : 对所有类可见。使用对象：类、接口、变量、方法
- **protected** : 对同一包内的类和所有子类可见。使用对象：变量、方法。 **注意：不能修饰类（外部类）**

| 修饰符      | 当前类 | 同一包内 | 子孙类(同一包) | 子孙类(不同包)                                                                     | 其他包 |
| :---------- | :----- | :------- | :------------- | :--------------------------------------------------------------------------------- | :----- |
| `public`    | Y      | Y        | Y              | Y                                                                                  | Y      |
| `protected` | Y      | Y        | Y              | Y/N（[说明](https://www.runoob.com/java/java-modifier-types.html#protected-desc)） | N      |
| `default`   | Y      | Y        | Y              | N                                                                                  | N      |
| `private`   | Y      | N        | N              | N                                                                                  | N      |

- 父类中声明为 public 的方法在子类中也必须为 public。
- 父类中声明为 protected 的方法在子类中要么声明为 protected，要么声明为 public，不能声明为 private。
- 父类中声明为 private 的方法，不能够被继承。

## 非访问修饰符

为了实现一些其他的功能，Java 也提供了许多非访问修饰符。

- static 修饰符，用来声明独立于对象的静态变量，无论一个类实例化多少对象，它的静态变量只有一份拷贝
- final 修饰符，用来修饰类、方法和变量，final 修饰的类不能够被继承，修饰的方法不能被继承类重新定义，修饰的变量为常量，是不可修改的
- abstract 修饰符，用来创建抽象类和抽象方法，抽象类不能用来实例化对象，声明抽象类的唯一目的是为了将来对该类进行扩充

  - **抽象方法**

    抽象方法是一种没有任何实现的方法，该方法的的具体实现由子类提供。

    抽象方法不能被声明成 final 和 static。

    任何继承抽象类的子类必须实现父类的所有抽象方法，除非该子类也是抽象类。

    如果一个类包含若干个抽象方法，那么该类必须声明为抽象类。抽象类可以不包含抽象方法。

    抽象方法的声明以分号结尾，例如：**public abstract sample();**。

    ```java
    public abstract class SuperClass{
        abstract void m(); //抽象方法
    }

    class SubClass extends SuperClass{
         //实现抽象方法
          void m(){
              .........
          }
    }
    ```

- synchronized 修饰符 ，声明的方法同一时间只能被一个线程访问。synchronized 修饰符可以应用于四个访问修饰符。
- transient 修饰符序列化的对象包含被 transient 修饰的实例变量时，java 虚拟机(JVM)跳过该特定的变量。
- volatile 修饰符，修饰的成员变量在每次被线程访问时，都强制从共享内存中重新读取该成员变量的值。而且，当成员变量发生变化时，会强制线程将变化值回写到共享内存。这样在任何时刻，两个不同的线程总是看到某个成员变量的同一个值。

## 运算符

## 位运算符

Java 定义了位运算符，应用于整数类型(int)，长整型(long)，短整型(short)，字符型(char)，和字节型(byte)等类型。

| 操作符 | 描述                                                                               | 例子                            |
| :----- | :--------------------------------------------------------------------------------- | :------------------------------ |
| ＆     | 如果相对应位都是 1，则结果为 1，否则为 0                                           | （A＆B），得到 12，即 0000 1100 |
| \|     | 如果相对应位都是 0，则结果为 0，否则为 1                                           | （A \| B）得到 61，即 0011 1101 |
| ^      | 如果相对应位值相同，则结果为 0，否则为 1                                           | （A ^ B）得到 49，即 0011 0001  |
| 〜     | 按位取反运算符翻转操作数的每一位，即 0 变成 1，1 变成 0。                          | （〜A）得到-61，即 1100 0011    |
| <<     | 按位左移运算符。左操作数按位左移右操作数指定的位数。                               | A << 2 得到 240，即 1111 0000   |
| >>     | 按位右移运算符。左操作数按位右移右操作数指定的位数。                               | A >> 2 得到 15 即 1111          |
| >>>    | 按位右移补零操作符。左操作数的值按右操作数指定的位数右移，移动得到的空位以零填充。 | A>>>2 得到 15 即 0000 1111      |

## 方法

```java
public static void main(String[] args) {
    System.out.println("Hello World");
}

public static int fib(int num) {
    if (num == 1 || num == 2) {
        return 1;
    } else {
        return fib(num - 2) + fib(num - 1);
    }
}
```
