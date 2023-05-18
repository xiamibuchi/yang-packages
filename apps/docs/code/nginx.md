# nginx

NGINX[engine x] 是一个 HTTP 和 反向代理服务，同时也是一个通用代理服务器(TCP/UDP/IMAP/POP3/SMTP)

1. 处理静态文件，索引文件以及自动索引
2. 反向代理加速(无缓存)，简单的负载均衡和容错
3. FastCGI，简单的负载均衡和容错
4. 模块化的结构。过滤器包括 gzipping, byte ranges, chunked responses, 以及 SSI-filter 。在 SSI 过滤器中，到同一个 proxy 或者 FastCGI 的多个子请求并发处理
5. SSL 和 TLS SNI 支持

> 理论上单节点的 Nginx 同时支持 5W 并发连接

## command

```bash
nginx -t # 校验配置。会返回配置路径，也可用来查看 config 地址
```

## try_files

```nginx
try_files指令
语法：try_files file ... uri 或 try_files file ... = code
默认值：无
作用域：server location
```

需要注意的是，只有最后一个参数可以引起一个内部重定向，之前的参数只设置内部 URI 的指向。最后一个参数是回退 URI 且必须存在，否则会出现内部 500 错误。命名的 location 也可以使用在最后一个参数中。与 rewrite 指令不同，如果回退 URI 不是命名的 location 那么$args不会自动保留，如果你想保留$args，则必须明确声明。

```nginx
try_files $uri $uri/ /index.php?q=$uri&$args;
```
