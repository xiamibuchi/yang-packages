# HTTP

HTTP，HyperText Transfer Protocol（超文本传输协议）

1. 基于 TCP/IP 通信协议来传递数据
2. 通信使用明文、请求和响应不会对通信方进行确认、无法保护数据的完整性
3. 应用层的面向对象的协议
4. 简单快速：客户向服务器请求服务时，只需传送请求方法和路径。
5. 灵活：HTTP 允许传输任意类型的数据对象。正在传输的类型由 Content-Type 加以标记
6. 无连接：限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接，可以节省传输时间。
7. 无状态：协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。

## 历史版本

- [HTTP/1.0](https://datatracker.ietf.org/doc/html/rfc1945)：传输内容格式不限制，增加 PUT、PATCH、HEAD、 OPTIONS、DELETE 命令
- [HTTP/1.1](https://tools.ietf.org/html/rfc2616)：持久连接(长连接，Keep-Alive)、节约带宽、HOST 域、管道机制（Pipelining）、分块传输编码
  - `Connection: keep-alive`：连接不断开，无需重新连接。但占用资源、意外断开会丢数据
  - 管道机制：同一个 TCP 连接上可发出多个请求，服务端并行处理请求
- HTTP/2.0：
  - 多路复用（通过单一的 HTTP/2 连接请求发起多重的请求-响应消息，多个请求 stream 共享一个 TCP 连接，实现多留并行而不是依赖建立多个 TCP 连接）
  - 支持二进制（Binary Framing）传送（实现方便且健壮），HTTP1.x 是字符串传送
  - 采用 HPACK 压缩算法压缩头部，减小了传输的体积。例如：METHOD GET 用 2 表示
  - 支持服务端推送
  - 请求优先级（如果流被赋予了优先级，它就会基于这个优先级来处理，由服务器决定需要多少资源来处理该请求
- [HTTP/3](https://datatracker.ietf.org/doc/html/rfc9114)
  - 替换 TCP 协议为 UDP 协议，HTTP 3.0 具有更低的延迟
  - Google 基于 UDP 协议创造 QUIC 协议（快速 UDP 互联网连接）
  - QUIC 实现可靠性的机制是使用了 Packet Number，这个序列号可以认为是 synchronize sequence number 的替代者，这个序列号也是递增的。与 syn 所不同的是，不管服务器有没有接收到数据包，这个 Packet Number 都会 + 1，而 syn 是只有服务器发送 ack 响应之后，syn 才会 + 1
  - 把机制从 TCP 中释放出来，自行在应用层处理，这样会更加灵活、可维护升级

> 由于 tcp/ip 本身有并发数限制，所以当资源一多，速度就显著慢下来。http2.0 中，一个 tcp/ip 请求可以请求多个资源，也就是说，只要一次 tcp/ip 请求，就可以请求若干个资源，分割成更小的帧请求，速度明显提升。HTTP 1.1 多个文件也可以共用一个 TCP，但是请求文件需要排队（一个请求过去，一个请求返回来，然后在进行下一个请求），而 HTTP 2.0 发现 2 个请求比较靠近，把 2 个请求打包成一个请求发过去；也就是说把几个请求打包成一个小块去请求，并行发送；即使一个阻塞了，另一个还能回来，可以并行的出去也可以并行的回来。

### 长连接

HTTP1.1 默认是长连接，也就是默认 Connection 的值就是 keep-alive，本次请求响应结束后，TCP 连接将仍然保持打开状态，所以浏览器可以继续通过相同的连接发送请求，节省了很多 TCP 连接建立和断开的消耗，还节约了带宽。

和 WebSocket 的区别：

1. Keep-alive 的确可以实现长连接，但是这个长连接是有问题的，本质上依然是客户端主动发起-服务端应答的模式，是没法做到服务端主动发送通知给客户端的。也就是说，在一个 HTTP 连接中，可以发送多个 Request，接收多个 Response。但是一个 request 只能有一个 response。而且这个 response 也是被动的，不能主动发起。开启了 Keep-alive，可以看出依然是一问一答的模式，只是省略了每次的关闭和打开操作。
2. WebSocket 是可以互相主动发起的。WebSocket 是类似 TCP 长连接的通讯模式，一旦 WebSocket 连接建立后，后续数据都以帧序列的形式传输。在客户端断开 WebSocket 连接或 Server 端断掉连接前，不需要客户端和服务端重新发起连接请求。在海量并发及客户端与服务器交互负载流量大的情况下，极大的节省了网络带宽资源的消耗，有明显的性能优势，且客户端发送和接受消息是在同一个持久连接上发起，实时性优势明显。

## 网络协议

五层网络协议：

1. 应用层（DNS，HTTP，SMTP，FTP）：一个端系统应用程序与另外一个端系统应用程序交换信息分组，我们把位于应用层的信息分组称为 报文(message)
2. 传输层（TCP，UDP）：运输层的分组称为报文段(segment)
3. 网络层（IP，ARP）：IP 寻址
4. 数据链路层（以太网、WiFi 和电缆接入的 DOCSIS 协议）：帧(frame)
5. 物理层（利用物理介质传输比特流）：物理传输（通过双绞线，电磁波等各种介质）

完整的 OSI 七层框架，与五层网络协议相比，多了会话层、表示层。

OSI 七层框架：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层

- 表示层：主要处理两个通信系统中交互信息的表示方式，包括数据格式交换，数据加密和解密，数据压缩和终端类型转换等。数据描述使得应用程序不必担心计算机内部存储格式的问题。解决两个系统间交换信息的语法与语义问题。
- 会话层：具体管理不同用户和进程之间的对话，如控制登录和注销过程。提供了数据交换的定界和同步功能，包括建立检查点和恢复方案。

## TCP/IP

> TCP: Transmission Control Protocol 传输控制协议，负责应用软件（比如你的浏览器）和网络软件之间的通信
> IP: Internet Protocol 网际协议，计算机用来相互识别的通信的一种机制

TCP/IP 协议族是按层次去划分的：

- 应用层，决定了向用户提供应用服务时通信的活动。
  - FTP 协议（文件传输协议）
  - DNS（域名协议）
  - HTTP（超文本传输协议）
- 传输层，提供处于网络连接中两台计算机之间的数据传输
  - TCP（传输控制协议）
  - UDP（用户数据报协议）
- 网络层，用来处理在网络上流动的数据包
  - IP 协议
- 数据链路层，用来处理连接网络的硬件设备

### 连接

[RFC 793 - Transmission Control Protocol](https://tools.ietf.org/html/rfc793) 文档中非常清楚地定义了 TCP 中的连接是什么，我们简单总结一下：用于保证可靠性和流控制机制的信息，包括 Socket、Sequence Number 以及 Window Size 叫做连接。

建立 TCP 连接就是通信的双方需要对上述的三种信息达成共识，连接中的一对 Socket 是由互联网地址标志符和端口组成的，窗口大小主要用来做流控制，最后的序列号是用来追踪通信发起方发送的数据包序号，接收方可以通过序列号向发送方确认某个数据包的成功接收。

### 三次握手

TCP 连接使用三次握手的首要原因 —— 为了阻止历史的重复连接初始化造成的混乱问题，防止使用 TCP 协议通信的双方建立了错误的连接。

首先，客户端与服务器均处于未连接状态，并且是客户端主动向服务器请求建立连接：

1. 客户端发送 SYN 报文，初始化序列号 SEQ（x），客户端变为 SYN_SEND 状态。（SEQ=x，CTL=SYN）
2. 服务器收到客户端的 SYN 报文之后，会以自己的 SYN 报文作为应答，并且也是指定了自己的初始化序列号 SEO。同时会把客户端的 SEQ + 1（x + 1） 作为 ACK 的值，表示自己已经收到了客户端的 SYN，此时服务器处于 SYN_RECEIVED 的状态（SEQ=y，ACK=x+1）
3. 客户端收到服务器的同步确认后，对服务器发送确认的确认，客户端进入已连接状态（ESTABLISHED）（SEQ=x+1， ACK=y+1，CTL=ACK）

> SYN：同步序列编号（Synchronize Sequence Numbers）。是 TCP/IP 建立连接时使用的握手信号。

### 四次挥手

现假设客户端与服务器均处于连接建立状态，客户端主动断开连接：

1. 客户端向服务器发送 FIN 报文：FIN=1,序号 seq=上一个最后传输的字节序号+1=u，发送后，客户端进入 FIN-WAIT-1 状态。
2. 服务器接收到该报文后，发送一个确认报文：令 ACK=1，确认序号 ack = u+1,自己的报文序号 seq=v，发送后，服务器进入 CLOSE-WAIT 状态。
3. 此时 TCP 连接进入连接半关闭状态，服务器可能还会向客户端发送一些数据。
4. 客户端收到来自服务器的确认之后，进入 FIN-WAIT-2 状态。等待服务器发送连接释放报文。
5. 如果服务器已经没有要发送的数据，则释放 TCP 连接，向客户端发送报文：令 FIN=1，ACK=1,确认号 ack =u+1，自己的序号 seq = w（w 可能等于 v 也可能大于 v），服务器进入 LAST-ACK 状态。
6. 客户端收到服务器的连接释放报文后，对该报文发出确认，令 ACK=1,确认号 ack=w+1，自己的序号 seq=u+1，发送此报文后，等待 2 个 msl 时间后，进入 CLOSED 状态。
7. 服务器收到客户端的确认后，也进入 CLOSED 状态并撤销传输控制块。

客户端状态变化：未连接----->SYN-SEND----->ESTABLISHED----->FIN-WAIT-1----->FIN-WAIT-2----->TIME-WAIT----->CLOSED

服务器状态变化：未连接----->SYN-RCVD----->ESTABLISHED----->CLOSE-WAIT----->LAST-ACK----->CLOSED

## DNS

DNS 查找流程：

1. 查找浏览器缓存
2. 查找系统缓存
3. 查找路由器缓存
4. 查找 ISP DNS 缓存（网络运营商）
5. 递归搜索。本地 DNS 服务器即将该请求转发到互联网上的根域，查找不到再追击向上

- DNS 的查找是有开销的
- 在 DNS 查找完成之前，浏览器不能从主机下载任何东西
- DNS 可以被缓存起来提高性能的，这种缓存可以发生在网络运营商的服务器上，也可以发在本机所处的局域网中，甚至可以发生在本地的操作系统或浏览器中
- 但是服务器的 IP 地址是可变的，缓存会消耗内存，因此不管是哪个级别的缓存都应该周期性的清除一下。

优化：

1. 一个多资源的站点最好使用 2 到 4 个不一样的主机来存放服务端资源。这是在减少 DNS 查询和允许高度并行下载之间作出的最好权衡(高度并行下载,浏览器一次能并发加载的量是受域名控制的)
2. 使用 Keep-alive 进行持久连接

在使用 CDN 的过程中，当用户点击网站页面上的内容 URL，经过本地 DNS 系统解析，DNS 系统会最终将域名的解析权交给 CNAME 指向的 CDN 专用 DNS 服务器

### 请求字段

#### 请求头

用于传递一些附加信息，格式为：`键: 值`

- Content-Type：请求体/响应体的类型
  - text/plain、application/json
- Accept：客户端能够处理的媒体类型，可以多个值，用`,`分开
  - 文本文件：text/html, text/plain, text/css, application/xml
  - 图片文件：iamge/jpeg, image/gif, image/png
  - 视频文件：video/mpeg
  - 应用程序使用的二进制文件：application/octet-stream, application/zip
- Accept-Charset：表示客户端支持的字符集
- Content-length：请求体/响应体的长度，单位字节
- Content-Encoding：请求体/响应体的编码格式
  - gzip: 由文件压缩程序 gzip 生成的编码格式；
  - compress: 由 Unix 文件压缩程序 compress 生成的编码格式；
  - deflate: 组合使用 zlib 和 deflate 压缩算法生成的编码格式；
  - identity：默认的编码格式，不执行压缩。
- Accept-Encoding：告知对方接受的 Content-Encoding
- Cache-Control：取值一般为 no-cache、max-age=xx，xx 为整数，表示资源缓存有效期（秒）
- ETag：给当前资源的标识，和 Last-Modified、If-None-Match、If-Modified-Since 配合，用于缓存控制
- Authorization：用于设置身份认证信息
- User-Agent：用户标识。
- If-Match：与所请求资源的 ETag 值（实体标记，与资源相关联。资源变化，实体标记跟着变化）一致时，服务器才处理此请求。
- If-Modified-Since：上一次服务器返回的 Last-Modified 值，用于确定某个资源是否被更改过，没有更改过就从缓存中读取
- If-None-Match：与所请求资源的 ETag 值不一致时服务器才处理此请求
- Cookie：已有 Cookie
- Referer：标识请求引用自哪个地址
- Host：请求的主机和端口号

#### 请求体

### 响应

```txt
HTTP/版本号 返回码 返回码描述
应答首部字段(可选)
空行
body
```

- Age：源服务器（而不是缓存服务器）在多久之前创建了响应
- ETag： 实体资源的标识，可用来请求指定的资源
- Location：请求的资源所在的新位置
- Proxy-Authenticate：将代理服务器需要的认证信息发送给客户端
- Retry-After：服务端告知客户端多久之后再重试，一般与 503 和 3xx 重定向类型的应答一起使用
- Server：告知服务端当前使用的 HTTP 服务器应用程序的相关信息
- WWW-Authenticate：告知客户端适用于所访问资源的认证方案，如 Basic 或 Digest。401 的响应中肯定带有
- Content-Encoding：告知客户端，服务器对资源的内容编码
- Content-Language：告知客户端，资源所使用的自然语言
- Content-Length：告知客户端资源的长度
- Content-Location：告知客户端资源所在的位置
- Content-Type：告知客户端资源的媒体类型，取值同请求首部字段中的 Accept
- Last-Modified：告知客户端资源最后一次修改的时间。

### URL

使用 HTTP 协议访问资源是通过 URL（Uniform Resource Locator）统一资源定位符来实现的。URL 的格式如下：

```txt
scheme://host:port/path?query

scheme: 表示协议，如Http, Https, Ftp等；
host: 表示所访问资源所在的主机名：如：www.abc.com;
port: 表示端口号，默认为80；
path: 表示所访问的资源在目标主机上的储存路径；
query: 表示查询条件；

例如： http://www.abc.com/search?words=abc
```

> [URI](https://developer.mozilla.org/en-US/docs/Glossary/URI)：统一资源标识符，而 URL 是统一资源定位符。每个 URL 都是 URI，但不一定每个 URI 都是 URL。URI 还包括一个子类，统一资源名称 (URN)，它命名资源但不指定如何定位资源。

一般情况下，资源的名称和位置由同一个 URL（统一资源定位符，它是 URI 的一种）来标识。也有某些特殊情况，资源的名称和位置由不同的 URI 进行标识：例如，待请求的资源希望客户端从另外一个位置访问它。我们可以使用一个特定的首部字段，[`Alt-Svc`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Alt-Svc)，来指示这种情况。

## HTTPS

HTTP 是明文传输的，这就意味着介于发送端和接收端之间的任意节点都可以知道传输的内容是什么，这些节点可以是路由器、代理等

HTTPS，经由 HTTP 进行通信，利用 SSL/TLS 建立全信道，加密数据包。HTTPS 比 HTTP 多了一层 TLS/SSL 协议

TLS（传输层安全）跟 SSL（安全套接字）可以理解成类似的东西，可以将 SSL 理解成负责对 HTTP 的数据进行加密的加密套件，而 TLS 是 SSL 的升级版/继任者。

TLS 的基本工作方式是，客户端使用非对称加密与服务器进行通信，实现身份验证并协商对称加密使用的密钥， 然后对称加密算法采用协商密钥对信息以及信息摘要进行加密通信，不同的节点之间采用的对称密钥不同，从而可以保证信息只能通信双方获取。

### 身份验证 CA 和证书

解决身份验证问题的关键是确保获取的公钥途径是合法的，能够验证服务器的身份信息，为此需要引入权威的第三方机构 CA(如沃通 CA)。CA 负责核实公钥的拥有者的信息，并颁发认证"证书"，同时能够为使用者提供证书验证服务，即 PKI 体系(PKI 基础知识)。
基本的原理为，CA 负责审核信息，然后对关键信息利用私钥进行"签名"，公开对应的公钥，客户端可以利用公钥验证签名。

### 特点

- 内容加密：采用混合加密技术，中间者无法直接查看明文内容
- 验证身份：通过证书认证客户端访问的是自己的服务器
- 保护数据完整性：防止传输的内容被中间人冒充或者篡改

**混合加密：**结合非对称加密和对称加密技术。客户端使用对称加密生成密钥对传输数据进行加密，然后使用非对称加密的公钥再对秘钥进行加密，所以网络上传输的数据是被秘钥加密的密文和用公钥加密后的秘密秘钥，因此即使被黑客截取，由于没有私钥，无法获取到加密明文的秘钥，便无法获取到明文数据。

**数字摘要：**通过单向 hash 函数对原文进行哈希，将需加密的明文“摘要”成一串固定长度(如 128bit)的密文，不同的明文摘要成的密文其结果总是不相同，同样的明文其摘要必定一致，并且即使知道了摘要也不能反推出明文。

**数字签名技术：**数字签名建立在公钥加密体制基础上，是公钥加密技术的另一类应用。它把公钥加密技术和数字摘要结合起来，形成了实用的数字签名技术。

> 非对称加密过程需要用到公钥进行加密，那么公钥从何而来？其实公钥就被包含在数字证书中，数字证书通常来说是由受信任的数字证书颁发机构 CA，在验证服务器身份后颁发，证书中包含了一个密钥对（公钥和私钥）和所有者识别信息。数字证书被放到服务端，具有服务器身份验证和数据传输加密功能。

### 缺点

- SSL 证书需要购买申请，功能越强大的证书费用越高
- SSL 证书通常需要绑定 IP，不能在同一 IP 上绑定多个域名，IPv4 资源不可能支撑这个消耗（SSL 有扩展可以部分解决这个问题，但是比较麻烦，而且要求浏览器、操作系统支持，Windows XP 就不支持这个扩展，考虑到 XP 的装机量，这个特性几乎没用）。
- 根据 ACM CoNEXT 数据显示，使用 HTTPS 协议会使页面的加载时间延长近 50%，增加 10%到 20%的耗电。
- HTTPS 连接缓存不如 HTTP 高效，流量成本高。
- HTTPS 连接服务器端资源占用高很多，支持访客多的网站需要投入更大的成本。
- HTTPS 协议握手阶段比较费时，对网站的响应速度有影响，影响用户体验。比较好的方式是采用分而治之，类似 12306 网站的主页使用 HTTP 协议，有关于用户信息等方面使用 HTTPS。

### 传输流程

1. 客户端使用 https 的 url 访问 web 服务器,要求与服务器建立 ssl 连接
1. web 服务器收到客户端请求后, 会将网站的证书(包含公钥)传送一份给客户端
1. 客户端收到网站证书后会检查证书的颁发机构以及过期时间, 如果没有问题就随机产生一个秘钥
1. 客户端利用公钥将会话秘钥加密, 并传送给服务端, 服务端利用自己的私钥解密出会话秘钥
1. 之后服务器与客户端使用秘钥加密传输

### 如何验证证书的合法性

1. 首先浏览器读取证书中的证书所有者、有效期等信息进行校验，校验证书的网站域名是否与证书颁发的域名一致，校验证书是否在有效期内
1. 浏览器开始查找操作系统中已内置的受信任的证书发布机构 CA，与服务器发来的证书中的颁发者 CA 比对，用于校验证书是否为合法机构颁发
1. 如果找不到，浏览器就会报错，说明服务器发来的证书是不可信任的。
1. 如果找到，那么浏览器就会从操作系统中取出颁发者 CA 的公钥(多数浏览器开发商发布
   版本时，会事先在内部植入常用认证机关的公开密钥)，然后对服务器发来的证书里面的签名进行解密
1. 浏览器使用相同的 hash 算法计算出服务器发来的证书的 hash 值，将这个计算的 hash 值与证书中签名做对比
1. 对比结果一致，则证明服务器发来的证书合法，没有被冒充

## ajax

Asynchronous [e'sɪŋkrənəs] Javascript And XML， AJAX 不是一门的新的语言，而是对现有技术的综合利用。 本质是在 HTTP 协议的基础上以异步的方式与服务器进行通信。

### XMLHttpRequest 对象

浏览器内建对象，用于与服务器通信(交换数据)

### GET 和 POST 请求的区别

1. HTTP 没有要求，如果 Method 是 POST 数据就要放在 BODY 中。也没有要求，如果 Method 是 GET，数据（参数）就一定要放在 URL 中而不能放在 BODY 中。但在浏览器中，GET 提交的数据会放在 URL 之后，POST 是把提交的数据放在 HTTP 消息的 Body 中
2. HTTP 协议从未规定过 GET/POST 请求长度是多少，GET 提交的数据大小有限制是某些浏览器或服务器对 URL 的长度有限制，而 POST 方法提交的数据没有限制
3. 多数浏览器对于 POST 采用两阶段发送数据的
4. GET 方式请求的数据会被浏览器缓存起来
5. GET 幂等，而 POST 请求不是

> 幂等性是指一次和多次请求某一个资源应该具有同样的副作用。简单来说意味着对同一 URL 的多个请求应该返回同样的结果。

### 跨域

浏览器的同源策略限制，浏览器会拒绝跨域请求

#### 简单请求和非简单请求

简单请求

- 请求方法是 HEAD、GET、POST 三种之一；
- HTTP 头信息不超过右边着几个字段：Accept、Accept-Language、Content-Language、Last-Event-ID
- Content-Type 只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain；

#### JSONP

利用资源请求标签（script）可引入不同域上的 js 脚本，在 js 文件载入完毕之后，触发回调

优点：兼容性好（兼容低版本 IE）
缺点：1.JSONP 只支持 GET 请求； 2.错误处理机制缺失

#### CORS

```txt
Access-Control-Allow-Origin: foo.example    // 标识可接受的跨域请求源；  Access-Control-Allow-Methods: POST, GET, OPTIONS   //标识可接受的跨域请求方法,如GET、POST、OPTIONS；
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type //标识可接受的跨域请求自定义头；
Access-Control-Max-Age: 86400。 //标识本次预请求的有效时间（秒），期间内无需再发送预请求；
```

#### postMessage

window.postMessage(message,targetOrigin) 方法是 html5 新引进的特性，可以使用它来向其它的 window 对象发送消息

```js
postMessage(message, targetOrigin);

// iframe
window.parent.postMessage('Hello from the main page!', '*');

// handle messages
window.addEventListener(
  'message',
  (event) => {
    // Do we trust the sender of this message?  (might be
    // different from what we originally opened, for example).
    if (event.origin !== 'http://example.com') return;

    // event.source is popup
    // event.data is "hi there yourself!  the secret response is: rheeeeet!"
  },
  false
);

// 如果需要指定 targetOrigin
let target = '';
try {
  target = parent.location.origin; // 跨域时无法获取 parent.location.origin
} catch (e) {
  // 仅在 referrer 不是同域名时才使用 referrer
  if (
    typeof document.referrer === 'string' &&
    !document.referrer.includes(location.origin)
  ) {
    target = document.referrer;
  }
}
if (!target) {
  target = 'xxxx'; // 需要给保底值
}
```

## fetch

```js
fetch(url, options).then(
  (response) => {
    // handle HTTP response
  },
  (error) => {
    // handle network error
  }
);
```

说明：

1. fetch api 返回的是一个 promise 对象
2. Options:
   - method(String): HTTP 请求方法，默认为 GET
   - body(String): HTTP 的请求参数
   - headers(Object): HTTP 的请求头，默认为{}
   - credentials(String): 默认为 omit,忽略的意思，也就是不带 cookie;还有两个参数，same-origin，意思就是同源请求带 cookie；include,表示无论跨域还是同源请求都会带 cookie
3. 第一个 then 函数里面处理的是 response 的格式
   - status(number): HTTP 返回的状态码，范围在 100-599 之间
     statusText(String): 服务器返回的状态文字描述，例如 Unauthorized,上图中返回的是 Ok
     ok(Boolean): 如果状态码是以 2 开头的，则为 true
     headers: HTTP 请求返回头
     body: 返回体，这里有处理返回体的一些方法
     text(): 将返回体处理成字符串类型
     json()： 返回结果和 JSON.parse(responseText)一样
     blob()： 返回一个 Blob，Blob 对象是一个不可更改的类文件的二进制数据
     arrayBuffer()
     formData()

### 问题

1. 兼容性
   IE 浏览器完全不支持 fetch，移动端的很多浏览器也不支持,所以，如果要在这些浏览器上使用 Fetch，就必须使用 fetch polyfill
2. cookie 传递
   必须在 header 参数里面加上 credientials: 'include'，才会如 xhr 一样将当前 cookies 带到请求中去
3. fetch 和 xhr 的不同
   fetch 虽然底层，但是还是缺少一些常用 xhr 有的方法，比如能够取消请求（abort）方法。fetch 在服务器返回 4xx、5xx 时是不会抛出错误的，这里需要手动通过，通过 response 中的 ok 字段和 status 字段来判断

## JSON

JSON(JavaScript Object Notation, JS 对象标记) 是一种轻量级的数据交换格式。它基于 ECMAScript 规范，采用独立于编程语言的文本格式来存储和表示数据。

特点：

- 数据在 键值对 中
- 数据由逗号分隔(最后一个 键值对 不能带逗号)
- 花括号保存对象，方括号保存数组
- 键使用双引号
- JSON 内部常用数据类型无非就是字符串、数字、布尔、日期、null 这么几个，字符串必须用双引号引起来，其余的都不用

优点：

- 基于纯文本，跨平台传简单；
- JavaScript 原生支持，后台语言几乎全部支持；
- 轻量级数据格式，占用字符数量少，适合互联网传递；
- 可读性较强
- 容易编写和解析

## XML

- XML 指可扩展标记语言（EXtensible Markup Language）
- XML 是一种标记语言，类似 HTML
- XML 的设计宗旨是传输数据，而非显示数据
- XML 标签没有被预定义，自行定义标签。

AJAX 可用来与 XML 文件进行交互式通信。

loadXMLDoc() 函数创建 XMLHttpRequest 对象，添加当服务器响应就绪时执行的函数，并将请求发送到服务器。
当服务器响应就绪时，会构建一个 HTML 表格，从 XML 文件中提取节点（元素），最后使用 XML 数据的 填充 id="demo" 的表格元素：

```js
function loadDoc() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myFunction(this);
    }
  };
  xhttp.open('GET', 'cd_catalog.xml', true);
  xhttp.send();
}
function myFunction(xml) {
  let i;
  const xmlDoc = xml.responseXML;
  let table = '<tr><th>Artist</th><th>Title</th></tr>';
  const x = xmlDoc.getElementsByTagName('CD');
  for (i = 0; i < x.length; i++) {
    table += `<tr><td>${
      x[i].getElementsByTagName('ARTIST')[0].childNodes[0].nodeValue
    }</td><td>${
      x[i].getElementsByTagName('TITLE')[0].childNodes[0].nodeValue
    }</td></tr>`;
  }
  document.getElementById('demo').innerHTML = table;
}
```

## 状态码

100——客户必须继续发出请求
101——客户要求服务器根据请求转换 HTTP 协议版本
200——交易成功
201——提示知道新文件的 URL
202——接受和处理、但处理未完成
203——返回信息不确定或不完整
204——请求收到，但返回信息为空
205——服务器完成了请求，用户代理必须复位当前已经浏览过的文件
206——服务器已经完成了部分用户的 GET 请求
300——请求的资源可在多处得到
301——删除请求数据
302——在其他地址发现了请求数据
303——建议客户访问其他 URL 或访问方式
304——客户端已经执行了 GET，但文件未变化
305——请求的资源必须从服务器指定的地址得到
306——前一版本 HTTP 中使用的代码，现行版本中不再使用
307——申明请求的资源临时性删除
400——错误请求，如语法错误
401——请求授权失败
402——保留有效 ChargeTo 头响应
403——请求不允许
404——没有发现文件、查询或 URl
405——用户在 Request-Line 字段定义的方法不允许
406——根据用户发送的 Accept，请求资源不可访问
407——类似 401，用户必须首先在代理服务器上得到授权
408——客户端没有在用户指定的饿时间内完成请求
409——对当前资源状态，请求不能完成
410——服务器上不再有此资源且无进一步的参考地址
411——服务器拒绝用户定义的 Content-Length 属性请求
412——一个或多个请求头字段在当前请求中错误
413——请求的资源大于服务器允许的大小
414——请求的资源 URL 长于服务器允许的长度
415——请求资源不支持请求项目格式
416——请求中包含 Range 请求头字段，在当前请求资源范围内没有 range 指示值，请求也不包含 If-Range 请求头字段
417——服务器不满足请求 Expect 头字段指定的期望值，如果是代理服务器，可能是下一级服务器不能满足请求
500——服务器产生内部错误
501——服务器不支持请求的函数
502——服务器暂时不可用，有时是为了防止发生系统过载
503——服务器过载或暂停维修
504——关口过载，服务器使用另一个关口或服务来响应用户，等待时间设定值较长
505——服务器不支持或拒绝支请求头中指定的 HTTP 版本

## Server-sent events

```js
const evtSource = new EventSource('ssedemo.php');
evtSource.onmessage = function (e) {
  const newElement = document.createElement('li');

  newElement.innerHTML = `message: ${e.data}`;
  eventList.appendChild(newElement);
};
```

## WebSocket

WebSocket 是一种网络通信协议。

因为 HTTP 协议有一个缺陷：通信只能由客户端发起，HTTP 协议做不到服务器主动向客户端推送信息。如果服务器有连续的状态变化，客户端要获知就非常麻烦。我们只能使用"轮询"。最典型的场景就是聊天室。

特点：

- 服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。
- 建立在 TCP 协议之上，服务器端的实现比较容易。
- 与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
- 数据格式比较轻量，性能开销小，通信高效。
- 可以发送文本，也可以发送二进制数据。
- 没有同源限制，客户端可以与任意服务器通信。
- 协议标识符是 ws（如果加密，则为 wss），服务器网址就是 URL。

```js
const ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = function (evt) {
  console.log('Connection open ...');
  ws.send('Hello WebSockets!');
};

ws.onmessage = function (evt) {
  console.log(`Received Message: ${evt.data}`);
  ws.close();
};

ws.onclose = function (evt) {
  console.log('Connection closed.');
};
```

### 构造函数

```js
const ws = new WebSocket('ws://localhost:8080');
```

此时，客户端会与服务端进行链接

### readyState

readyState 属性返回实例对象的当前状态，共有四种。

- CONNECTING：值为 0，表示正在连接。
- OPEN：值为 1，表示连接成功，可以通信了。
- CLOSING：值为 2，表示连接正在关闭。
- CLOSED：值为 3，表示连接已经关闭，或者打开连接失败。

```js
switch (ws.readyState) {
  case WebSocket.CONNECTING:
    // do something
    break;
  case WebSocket.OPEN:
    // do something
    break;
  case WebSocket.CLOSING:
    // do something
    break;
  case WebSocket.CLOSED:
    // do something
    break;
  default:
    // this never happens
    break;
}
```

### onopen

websocket 实例对象的属性，用于指定连接成功后的回掉函数

```js
ws.onopen = function () {
  ws.send('Hello Server');
};
```

如果要指定多个回调函数，可以使用 addEventListener 方法。

```js
ws.addEventListener('open', (event) => {
  ws.send('Hello Server!');
});
```

### onclose

实例对象的 onclose 属性，用于指定连接关闭后的回调函数。

```js
ws.onclose = function (event) {
  const code = event.code;
  const reason = event.reason;
  const wasClean = event.wasClean;
  // handle close event
};

ws.addEventListener('close', (event) => {
  const code = event.code;
  const reason = event.reason;
  const wasClean = event.wasClean;
  // handle close event
});
```

### onmessage

实例对象的 onmessage 属性，用于指定收到服务器数据后的回调函数。

```js
ws.onmessage = function (event) {
  const data = event.data;
  // 处理数据
};

ws.addEventListener('message', (event) => {
  const data = event.data;
  // 处理数据
});
```

> 注意，服务器数据可能是文本，也可能是二进制数据（blob 对象或 Arraybuffer 对象）。

除了动态判断收到的数据类型，也可以使用 binaryType 属性，显式指定收到的二进制数据类型。

```js
// 收到的是 blob 数据
ws.binaryType = 'blob';
ws.onmessage = function (e) {
  console.log(e.data.size);
};

// 收到的是 ArrayBuffer 数据
ws.binaryType = 'arraybuffer';
ws.onmessage = function (e) {
  console.log(e.data.byteLength);
};
```

### send

实例对象的 send()方法用于向服务器发送数据。

发送文本的例子。

```js
ws.send('your message');
```

发送 Blob 对象的例子。

```js
const file = document.querySelector('input[type="file"]').files[0];
ws.send(file);
```

发送 ArrayBuffer 对象的例子。

```js
// Sending canvas ImageData as ArrayBuffer
const img = canvasContext.getImageData(0, 0, 400, 320);
const binary = new Uint8Array(img.data.length);
for (let i = 0; i < img.data.length; i++) {
  binary[i] = img.data[i];
}
ws.send(binary.buffer);
```

### bufferedAmount

实例对象的 bufferedAmount 属性，表示还有多少字节的二进制数据没有发送出去。它可以用来判断发送是否结束。

```js
const data = new ArrayBuffer(10000000);
socket.send(data);

if (socket.bufferedAmount === 0) {
  // 发送完毕
} else {
  // 发送还没结束
}
```

### onerror

```js
socket.onerror = function (event) {
  // handle error event
};

socket.addEventListener('error', (event) => {
  // handle error event
});
```

## TCP 和 UDP 的区别

TCP/IP 协议是一个协议簇。里面包括很多协议的，UDP 只是其中的一个， 之所以命名为 TCP/IP 协议，因为 TCP、IP 协议是两个很重要的协议，就用他两命名了。

TCP/IP 协议集包括应用层,传输层，网络层，网络访问层。

## 其中应用层包括:

1、超文本传输协议（HTTP）:万维网的基本协议；
2、文件传输（TFTP 简单文件传输协议）；
3、远程登录（Telnet），提供远程访问其它主机功能, 它允许用户登录 internet 主机，并在这台主机上执行命令；
4、网络管理（SNMP 简单网络管理协议），该协议提供了监控网络设备的方法， 以及配置管理,统计信息收集,性能管理及安全管理等；
5、域名系统（DNS），该系统用于在 internet 中将域名及其公共广播的网络节点转换成 IP 地址。

## 其次网络层包括:

1、Internet 协议（IP）；
2、Internet 控制信息协议（ICMP）；
3、地址解析协议（ARP）；
4、反向地址解析协议（RARP）。

## 最后说网络访问层:

网络访问层又称作主机到网络层（host-to-network），网络访问层的功能包括 IP 地址与物理地址硬件的映射， 以及将 IP 封装成帧.基于不同硬件类型的网络接口，网络访问层定义了和物理介质的连接. 当然我这里说得不够完善，TCP/IP 协议本来就是一门学问，每一个分支都是一个很复杂的流程， 但我相信每位学习软件开发的同学都有必要去仔细了解一番。

## **下面着重讲解一下 TCP 协议和 UDP 协议的区别**

TCP（Transmission Control Protocol，传输控制协议）是面向连接的协议，也就是说，在收发数据前，必须和对方建立可靠的连接。 一个 TCP 连接必须要经过三次“对话”才能建立起来，其中的过程非常复杂， 只简单的描述下这三次对话的简单过程：

1）主机 A 向主机 B 发出连接请求数据包：“我想给你发数据，可以吗？”，这是第一次对话；

2）主机 B 向主机 A 发送同意连接和要求同步 （同步就是两台主机一个在发送，一个在接收，协调工作）的数据包 ：“可以，你什么时候发？”，这是第二次对话；

3）主机 A 再发出一个数据包确认主机 B 的要求同步：“我现在就发，你接着吧！”， 这是第三次对话。

三次“对话”的目的是使数据包的发送和接收同步， 经过三次“对话”之后，主机 A 才向主机 B 正式发送数据。

## **TCP 三次握手过程**

第一次握手：主机 A 通过向主机 B 发送一个含有同步序列号的标志位的数据段给主机 B，向主机 B 请求建立连接，通过这个数据段， 主机 A 告诉主机 B 两件事：我想要和你通信；你可以用哪个序列号作为起始数据段来回应我。

第二次握手：主机 B 收到主机 A 的请求后，用一个带有确认应答（ACK）和同步序列号（SYN）标志位的数据段响应主机 A，也告诉主机 A 两件事：我已经收到你的请求了，你可以传输数据了；你要用那个序列号作为起始数据段来回应我

第三次握手：主机 A 收到这个数据段后，再发送一个确认应答，确认已收到主机 B 的数据段："我已收到回复，我现在要开始传输实际数据了，这样 3 次握手就完成了，主机 A 和主机 B 就可以传输数据了。

## **3 次握手的特点**

没有应用层的数据 ,SYN 这个标志位只有在 TCP 建立连接时才会被置 1 ,握手完成后 SYN 标志位被置 0。

## **TCP 建立连接要进行 3 次握手，而断开连接要进行 4 次**

第一次： 当主机 A 完成数据传输后,将控制位 FIN 置 1，提出停止 TCP 连接的请求 ；

第二次： 主机 B 收到 FIN 后对其作出响应，确认这一方向上的 TCP 连接将关闭,将 ACK 置 1；

第三次： 由 B 端再提出反方向的关闭请求,将 FIN 置 1 ；

第四次： 主机 A 对主机 B 的请求进行确认，将 ACK 置 1，双方向的关闭结束.。

由 TCP 的三次握手和四次断开可以看出，TCP 使用面向连接的通信方式， 大大提高了数据通信的可靠性，使发送数据端和接收端在数据正式传输前就有了交互， 为数据正式传输打下了可靠的基础。

## 名词解释

1、ACK 是 TCP 报头的控制位之一，对数据进行确认。确认由目的端发出， 用它来告诉发送端这个序列号之前的数据段都收到了。 比如确认号为 X，则表示前 X-1 个数据段都收到了，只有当 ACK=1 时,确认号才有效，当 ACK=0 时，确认号无效，这时会要求重传数据，保证数据的完整性。

2、SYN 同步序列号，TCP 建立连接时将这个位置 1。

3、FIN 发送端完成发送任务位，当 TCP 完成数据传输需要断开时,，提出断开连接的一方将这位置 1。

这样我们得出了 TCP 包头的最小长度，为 20 字节。

## **UDP（User Data Protocol，用户数据报协议）**

1、UDP 是一个非连接的协议，传输数据之前源端和终端不建立连接， 当它想传送时就简单地去抓取来自应用程序的数据，并尽可能快地把它扔到网络上。 在发送端，UDP 传送数据的速度仅仅是受应用程序生成数据的速度、 计算机的能力和传输带宽的限制； 在接收端，UDP 把每个消息段放在队列中，应用程序每次从队列中读一个消息段。

2、 由于传输数据不建立连接，因此也就不需要维护连接状态，包括收发状态等， 因此一台服务机可同时向多个客户机传输相同的消息。

3、UDP 信息包的标题很短，只有 8 个字节，相对于 TCP 的 20 个字节信息包的额外开销很小。

4、吞吐量不受拥挤控制算法的调节，只受应用软件生成数据的速率、传输带宽、 源端和终端主机性能的限制。

5、UDP 使用尽最大努力交付，即不保证可靠交付， 因此主机不需要维持复杂的链接状态表（这里面有许多参数）。

6、UDP 是面向报文的。发送方的 UDP 对应用程序交下来的报文， 在添加首部后就向下交付给 IP 层。既不拆分，也不合并，而是保留这些报文的边界， 因此，应用程序需要选择合适的报文大小。

我们经常使用“ping”命令来测试两台主机之间 TCP/IP 通信是否正常， 其实“ping”命令的原理就是向对方主机发送 UDP 数据包，然后对方主机确认收到数据包， 如果数据包是否到达的消息及时反馈回来，那么网络就是通的。

**ping 命令**是用来探测主机到主机之间是否可通信，如果不能**ping**到某台主机，表明不能和这台主机建立连接。**ping 命令**是使用 IP 和网络控制信息协议 (ICMP)，因而没有涉及到任何传输协议(UDP/TCP) 和应用程序。它发送 icmp 回送请求消息给目的主机。

ICMP 协议规定：目的主机必须返回 ICMP 回送应答消息给源主机。如果源主机在一定时间内收到应答，则认为主机可达。

## **小结 TCP 与 UDP 的区别：**

1、基于连接与无连接；

2、对系统资源的要求（TCP 较多，UDP 少）；

3、UDP 程序结构较简单；

4、流模式与数据报模式 ；

5、TCP 保证数据正确性，UDP 可能丢包；

6、TCP 保证数据顺序，UDP 不保证。

## 网络攻击

### DOS、DDOS

DOS（Denial of Service），造成远程服务器拒绝服务的行为，叫做 DOS 攻击。

DOS 攻击的目的：使计算机或网络无法提供正常的服务。

DDOS：分布式拒绝服务，是 DOS 攻击的一种方法。

### CSRF

CSRF：Cross Site Requset Forgery，跨站请求伪造

1. 受害者用户正常登录网站 A，输入个人信息，在本地保存 cookie
   攻击者构建一条恶意链接
2. 受害者打开了攻击者构建的恶意链接，浏览器发出该恶意链接的请求，请求时发送本地保存的 cookie 到网址 A
3. A 网站收到 cookie，以为此请求时受害者发出的，导致受害者身份被盗用，完成恶意攻击的目的。

### XSS

XSS：Cross Site Scripting , 跨站脚本攻击

动态脚本注入

1. 窃取`Cookie`。
2. 监听用户行为，比如输入账号密码后直接发送到黑客服务器。
3. 修改 DOM 伪造登录表单。
4. 在页面中生成浮窗广告。

通常情况，XSS 攻击的实现有三种方式——**存储型**、**反射型**和**文档型**。

#### 存储型

`存储型`，将恶意脚本存储了起来，确实，存储型的 XSS 将脚本存储到了服务端的数据库，然后在客户端执行这些脚本，从而达到攻击的效果。

常见的场景是留言评论区提交一段脚本代码，如果前后端没有做好转义的工作，那评论内容存到了数据库，在页面渲染过程中`直接执行`, 相当于执行一段未知逻辑的 JS 代码。

#### 反射型

`反射型XSS`指的是恶意脚本作为**网络请求的一部分**。

比如我输入:

```
http://sanyuan.com?q=<script>alert("你完蛋了")</script>
复制代码
```

在服务器端会拿到`q`参数,然后将内容返回给浏览器端，浏览器将这些内容作为 HTML 的一部分解析，发现是一个脚本，直接执行，这样就被攻击了。

之所以叫它`反射型`, 是因为恶意脚本是通过作为网络请求的参数，经过服务器，然后再反射到 HTML 文档中，执行解析。和`存储型`不一样的是，服务器并不会存储这些恶意脚本。

#### 文档型

文档型的 XSS 攻击并不会经过服务端，而是作为中间人的角色，在数据传输过程劫持到网络数据包，然后**修改里面的 html 文档**！

这样的劫持方式包括`WIFI路由器劫持`或者`本地恶意软件`等。

### 防范措施

明白了三种`XSS`攻击的原理，我们能发现一个共同点: 都是让恶意脚本直接能在浏览器中执行。

那么要防范它，就是要避免这些脚本代码的执行：

1. 千万不要相信任何用户的输入。无论是在前端和服务端，都要对用户的输入进行**转码**或者**过滤**。
2. 利用 CSP。CSP，即浏览器中的内容安全策略，它的核心思想就是服务器决定浏览器加载哪些资源。限制其他域下的资源加载。禁止向其它域提交数据。提供上报机制，能帮助我们及时发现 XSS 攻击。
3. 利用 HttpOnly。很多 XSS 攻击脚本都是用来窃取 Cookie, 而设置 Cookie 的 HttpOnly 属性后，JavaScript 便无法读取 Cookie 的值。这样也能很好的防范 XSS 攻击。

## [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)

在 HTTP 协议中，Content-Security-Policy (CSP) 首部字段中的 default-src 指令可以为其他 CSP 拉取指令（fetch directives）提供备选项。对于以下列出的指令，假如不存在的话，那么用户代理会查找并应用 default-src 指令的值。

default-src 策略允许指定一个或多个源：

```
HTTP header:
Content-Security-Policy: default-src https: 'unsafe-eval' 'unsafe-inline'; object-src 'none'

HTML meta element
<meta http-equiv="Content-Security-Policy" content="default-src https:" />
```

`Content-Security-Policy: default-src <source>;`
`Content-Security-Policy: default-src <source> <source>;`

## 正向代理（Forward Proxy）和反向代理（Reverse Proxy）

一般给客户端做代理的都是正向代理，给服务器做代理的就是反向代理。
