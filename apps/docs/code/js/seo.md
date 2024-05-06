# SEO

https://moz.com/learn/seo/on-site-seo

```html
<title></title>
<meta
  name="keywords"
  content="science,education,culture,politics,ecnomics，relationships,entertaiment,human"
/>
<meta name="description" content=",education,culture." />
<meta name="robots" content="none" />
```

## robots

The Robots Exclusion Protocol (REP)

[Google 的 robots.txt 解析器现在开放源代码了

bookmark_border](https://developers.google.com/search/blog/2019/07/repp-oss?hl=zh-cn)

告诉爬虫什么内容可以抓取，什么内容不可以抓取。它是机器人排除协议（REP）的一部分。

### meta robot

```html
<!-- Google 的爬虫 Googlebot 不要在搜索引擎中为该页面编制索引，也不要跟踪任何反向链接 -->
<meta name="googlebot" content="noindex，nofollow" />

<meta name="robots" content="[PARAMETER]" />
```

- noindex: Tells a search engine not to index a page.
- index: Tells a search engine to index a page. Note that you don’t need to add this meta tag; it’s the default.
- follow: Even if the page isn’t indexed, the crawler should follow all the links on a page and pass equity to the linked pages.
- nofollow: Tells a crawler not to follow any links on a page or pass along any link equity.
- noimageindex: Tells a crawler not to index any images on a page.
- none: Equivalent to using both the noindex and nofollow tags simultaneously.
- noarchive: Search engines should not show a cached link to this page on a SERP.
- nocache: Same as noarchive, but only used by Internet Explorer and Firefox.
- nosnippet: Tells a search engine not to show a snippet of this page (i.e. meta description) of this page on a SERP.
- noodyp/noydir [OBSOLETE]: Prevents search engines from using a page’s DMOZ description as the SERP snippet for this page. However, DMOZ was retired in early 2017, making this tag obsolete.
- unavailable_after: Search engines should no longer index this page after a particular date.

### X-robots-tag

通过 HTTP header 告知 robot

## canonical + alternate

canonical 用于指示页面地址重复但内容相同的页面：

- `https://www.shenyang.com`
- `https://www.shenyang.com?abc=1`
- `https://www.shenyang.com/home-page?abc=1`

以上三个地址实际都指向首页，可以用 `<link rel="canonical" href="https://www.shenyang.com" />` 告知爬虫其他的页面只是首页的变体。

alternate 用来告诉爬虫当前页的变体，如多语言、桌面和移动端:

- `<link rel="alternate" hreflang="en-US" href="https://www.shenyang.com?lang=en-US" />`
- `<link rel="alternate" hreflang="zh-CN" href="https://www.shenyang.com?lang=zh-CN" />`

## 使用 schema.org + microdata 在 Google+ 上提供丰富的摘要

```html
<div itemscope itemtype="http://schema.org/Article">
  <h1 itemprop="name">Enjoy fireworks</h1>
  <p itemprop="description">
    Fireworks are beautiful. This article explains how beautiful fireworks are.
  </p>
  <img itemprop="image" src="//developers.google.com/web/imgs/fireworks.jpg" />
</div>
```

## 页面增加开放图表协议 (OGP)

[Metadata](https://ogp.me/)

- og:title - The title of your object as it should appear within the graph, e.g., "The Rock".
- og:type - The type of your object, e.g., "video.movie". Depending on the type you specify, other properties may also be required.
- og:image - An image URL which should represent your object within the graph.
  - og:image should be at least 200px in both dimensions, with 1500x1500 preferred. (Maximum image size is 5MB.)
- og:url - The canonical URL of your object that will be used as its permanent ID in the graph, e.g., "https://www.imdb.com/title/tt0117500/".
- ...

```html
<html prefix="og: https://ogp.me/ns#">
  <head>
    <title>The Rock (1996)</title>
    <meta property="og:title" content="The Rock" />
    <meta property="og:type" content="video.movie" />
    <meta property="og:url" content="https://www.imdb.com/title/tt0117500/" />
    <meta
      property="og:image"
      content="https://ia.media-imdb.com/images/rock.jpg"
    />
    ...
  </head>
  ...
</html>
```

### debug

- facebook：https://developers.facebook.com/tools/debug

https://developers.google.com/search/docs/beginner/get-started

## 搜索平台

### Google Search

[Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start?hl=zh-cn)

Google 推出的一款工具，可以帮助任何拥有网站的用户了解其网站在 Google 搜索中的表现，以及如何改进网站在 Google 搜索上的呈现效果，使网站获得更相关的流量。

Search Console 提供了与 Google 如何抓取网站、将网站编入索引和呈现网站相关的信息。这有助于网站所有者监控和优化其网站在 Google 搜索上的表现。

### 百度搜索资源平台

https://ziyuan.baidu.com/linksubmit

### bing

https://www.bing.com/webmasters/home

## schema

[官网](https://schema.org/)

- https://schema.org/MobileApplication
- https://schema.org/Offer
- https://schema.org/Article

## sitemap.txt

https://developers.google.cn/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=zh-cn

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.example.com/foo.html</loc>
    <lastmod>2022-06-04</lastmod>
  </url>
</urlset>
```

在 robots.txt 中定义：

```txt
# robots.txt file of https://example.com/
sitemap: https://sitemaps.example.com/sitemap-example-com.xml
```
