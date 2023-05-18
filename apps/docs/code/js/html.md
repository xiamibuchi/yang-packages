# HTML

特点：

1. DOCTYPE 更简单`<!DOCTYPE html>`
2. 简单的编码类型 `<meta charset=”utf-8″ />`
3. 大小不敏感 `<input tYPe="text" name="" id="">`
4. 布尔值 `<input type="radio" checked>`
5. 可以省略引号 `<input type=radio>`
6. 可以进行省略的标签
   1. 不允许写的结束符的标签：area、basebr、col、command、embed、hr、img、input、keygen、link、meta、param、source、track、wbr
   2. 可以省略结束符的标签：li、dt、dd、p、rt、optgroup、option、colgroup、thread、tbody、tr、td、th
   3. 可以完全省略的标签：html、head、body、colgroup、tbody

## DOCTYPE

DOCTYPE 是 Document Type Declaration (DTD)，它的目的是要告诉标准通用标记语言解析器，它应该使用什么样的文档类型定义来解析文档。只有确定了一个正确的文档类型，超文本标记语言或可扩展超文本标记语言中的标签和层叠样式表才能生效，甚至对 Javascript 脚本都会有所影响。

## 编码类型

`<meta charset=”utf-8″ />`

## 全局属性 任何标签都可以使用

```html
<!-- data-*  自定义属性 -->
<input type="text" data-curtime="20140818" name="time" id="time" />
<script>
  //js获取方式
  const oTime = document.getElementById("time");
  alert(oTime.dataset.curtime);
</script>

<!-- dir -->
<!-- 控制元素文本的方向 -->
<span dir="ltr">你看不见我</span>

<!-- hidden -->
<span hidden>你看不见我</span>

<!-- spellcheck -->
<!--spellcheck会对这里输入的内容进行语法纠错-->
<textarea spellcheck="true" name="" id="" cols="30" rows="10">
    likke spellcheck会对这里输入的内容进行语法纠错
</textarea>

<!-- contenteditable -->
<!-- 这里的内容是可以编辑的 -->
<p contenteditable="true">这里的内容是可以编辑的</p>

<!-- desginmode -->
<!-- 这个是针对js使用的，设置on元素就可编辑 off为不可编辑 -->
<script>
  window.document.designMode = "on"; //整个html都可以编辑
</script>

<!-- tabindex -->
<label>First in tab order:<input type="text"></label>
<div tabindex="0">Tabbable due to tabindex.</div>
<div>Not tabbable: no tabindex.</div>
<label>Third in tab order:<input type="text"></label>

<!-- 内容是否翻译 translate -->
<span translate="no">BrandName</span></small>
```

## meta 标签

HTML 中的 `<meta>` 元素，是 head 区的一个辅助性标签。可用于搜索引擎优化、控制页面缓存、网页显示等。

meta 标签的组成：meta 标签共有两个属性，它们分别是 http-equiv 属性和 name 属性，不同的属性又有不同的参数值，这些不同的参数值就实现了不同的网页功能。

### name

name 属性主要用于描述网页，与之对应的属性值为 content，content 中的内容主要是便于搜索引擎机器人查找信息和分类信息用的。

如：robots

说明：robots 用来告诉搜索机器人哪些页面需要索引，哪些页面不需要索引。

content 的参数有 all,none,index,noindex,follow,nofollow。默认是 all。

举例：`<meta name="robots"content="none">`

```html
<!-- 是否发送 referer -->
<meta name="referrer" content="origin" />
```

### http-equiv 属性

[http-equiv](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#http-equiv) 相当于 similarly-named HTTP header

## 常用

```html
<!DOCTYPE html>
<!-- https://www.zhihu.com/question/20797118?utm_source=weibo&utm_medium=weibo_share&utm_content=share_question&utm_campaign=share_sidebar -->
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <!-- iOS -->
    <meta name="apple-mobile-web-app-title" content="标题" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <!-- 工具栏颜色 -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <!-- 极速模式(webkit) -->
    <meta name="renderer" content="webkit" />
    <!-- 避免IE使用兼容模式 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- uc强制竖屏 -->
    <meta name="screen-orientation" content="portrait" />
    <!-- QQ强制竖屏 -->
    <meta name="x5-orientation" content="portrait" />
  </head>
</html>
```
