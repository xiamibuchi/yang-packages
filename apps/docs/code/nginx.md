# nginx

NGINX[engine x] 是一个 HTTP 和 反向代理服务，同时也是一个通用代理服务器(TCP/UDP/IMAP/POP3/SMTP)

1. 处理静态文件，索引文件以及自动索引
2. 反向代理加速(无缓存)，简单的负载均衡和容错
3. FastCGI，简单的负载均衡和容错
4. 模块化的结构。过滤器包括 gzipping, byte ranges, chunked responses, 以及 SSI-filter 。在 SSI 过滤器中，到同一个 proxy 或者 FastCGI 的多个子请求并发处理
5. SSL 和 TLS SNI 支持

> 理论上单节点的 Nginx 同时支持 5W 并发连接

## command

```shell
# 校验配置。会返回配置路径，也可用来查看 config 地址
nginx -t

# -c 指定配置文件
nginx -t -c xxx/nginx.conf

# 启动 (-c 可以指定配置文件)
nginx

# 重启 (因改变了Nginx相关配置，需要重新加载配置而重载)
nginx -s reload

# 快速关闭 (不保存相关信息，并迅速终止web服务)
nginx -s stop

# 平稳关闭 (保存相关信息，有安排的结束web服务)
nginx -s quit

# 开机启动
brew services start nginx

# 重启
brew services restart nginx

# 关闭
brew services stop nginx

# 查看进程
ps -ef | grep nginx

#关闭单个进程
kill -s QUIT 单个进程号

# 快速停止 Nginx：
kill -TERM 主进程号

# 强制停止 Nginx：
pkill -9 nginx
```

## 配置路径

- 安装目录: /usr/local/Cellar/nginx
- 默认配置文件: /usr/local/etc/nginx/nginx.conf
- 服务器默认路径:/usr/local/var/www

## 常用内置变量

- $args: query string 参数
- $arg_name: 获取请求  query string  参数中, key 为 name 的值
- $cookie_name: 获取请求中的名称为  name  的 cookie
- $http*name: name  为请求头中的字段名称，请求头名称全部小写，并将破折号 -  替换为下划线  * , 例如 $http_user_agent  获取请求头中的  User-Agent  字段
- $host: ip, 如果没有请求头中没有  Host  请求头，那么获取的是  url  中的  ip
- $uri: path, 不包括  query string, 如 localhost:8888/path/route?args=xxx 等于 /path/route
- $request_uri: path + query string, 如 localhost:8888/path/route?args=xxx 等于 /path/route?args=xxx
- $request_method: 获取请求方法, 值均为大写, 如为 GET,POST,DELETE,PUT

```conf
http {
  server{
    listen 80;
    server_name www.example.com;

    location / {
      # 正常状态下访问, 显示PC端网站
      root /var/www/html/pc;

      # 当用户为移动设备时, 显示移动端网站 (~* -> 正则匹配)
      if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
        root /var/www/html/mobile;
      }
      index index.html;
    }
  }
}
```

## config

### http

http 块是 Nginx 服务器配置中的重要部分，代理、缓存和日志定义等绝大多数的功能，包含了 http 全局块、upstream 块、server 块。在这里主要讲解 http 全局块的配置。

```conf
  http {
    include mime.types; #文件扩展名与文件类型映射表
    default_type application/octet-stream; #默认文件类型
    charset utf-8; #默认编码

    server_names_hash_bucket_size 128; #服务器名字的 hash 表大小
    client_header_buffer_size 32k; #上传文件大小限制
    large_client_header_buffers 4 64k; #设定请求缓
    client_max_body_size 8m; #设定请求缓
    sendfile on; #开启高效文件传输模式，普通应用设为on，下载等重应用设为off
    autoindex on; #开启目录列表访问，合适下载服务器，默认关闭
    tcp_nopush on; #防止网络阻塞
    tcp_nodelay on; #防止网络阻塞

    ##连接客户端超时时间各种参数设置##
    keepalive_timeout 120; #单位是秒，客户端连接时时间，超时后服务器端自动关闭连接
    client_header_timeout 10; #客户端请求头的超时时间
    client_body_timeout 10; #客户端请求主体超时时间
    reset_timedout_connection on; #告诉 Nginx 关闭不响应的客户端连接
    send_timeout 10; #客户端响应超时时间，在两次客户端读取操作之间

    #FastCGI 可以将Web服务器和应用程序间(Java/Golang)的通信转换为基于TCP/IP的套接字连接
    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers 4 64k;
    fastcgi_busy_buffers_size 128k;
    fastcgi_temp_file_write_size 128k;

    #传输文件压缩 gzip 模块设置, 需要和 --with-http_gzip_static_module 一起编译
    gzip on; #开启 gzip 压缩输出
    gzip_min_length 1k; #最小压缩文件大小
    gzip_buffers 4 16k; #压缩缓冲区
    gzip_http_version 1.0; #压缩版本（默认 1.1，前端如果是 squid2.5 请使用 1.0）
    gzip_comp_level 2; #压缩等级 (1 最小处理最快, 9 处理最慢传输速度最快)
    gzip_types text/plain application/x-javascript text/css application/xml; #压缩类型，默认就已经包含 text/html
    gzip_vary on; #设置为开启，服务器返回数据时会在头部带上"Vary:Accept-Encoding"的标识, 默认关闭

    #代理缓存服务器设置
    proxy_connect_timeout 10; #服务器连接的超时时间
    proxy_read_timeout 180; #连接成功后,等候后端服务器响应时间
    proxy_send_timeout 5; #后端服务器数据回传时间
    proxy_buffer_size 16k; #缓冲区的大小
    proxy_buffers 4 32k; #每个连接设置缓冲区的数量为number，每块缓冲区的大小为size
    proxy_busy_buffers_size 96k; #开启缓冲响应的功能以后，在没有读到全部响应的情况下，写缓冲到达一定大小时，nginx一定会向客户端发送响应，直到缓冲小于此值
    proxy_temp_file_write_size 96k; #设置nginx每次写数据到临时文件的size限制
    proxy_temp_path /tmp/temp_dir; #从后端服务器接收的临时文件的存放路径
    proxy_cache_path /tmp/cache levels=1:2 keys_zone=cache_one:512m inactive=10m max_size=64m;
    #以上 proxy_temp_path 和 proxy_cache_path 需要在同一个分区中
    #其中 levels=1:2 缓存级别, 表示采用2级目录结构
    #其中 keys_zone=cache_one:512m 缓存空间起名为 cache_one 大小为 512m
    #其中 max_size=64m 表示单个文件超过64m就不缓存了
    #其中 inactive=10m 表示缓存的数据, 10分钟内没有被访问过就删除


    # 例 - 反向缓存代理服务器
    server {
      listen 80;
      server_name localhost;
      root /Users/html/;

      #要缓存文件的后缀，可以在以下设置。
      location ~ .*.(gif|jpg|png|css|js)(.*) {
        proxy_pass http://ip地址:8080; # nginx缓存里拿不到资源，向该地址转发请求，拿到新的资源，并进行缓存
        proxy_redirect off; # 设置后端服务器“Location”响应头
        proxy_set_header Host $host; #允许重新定义或者添加发往后端服务器的请求头
        proxy_cache cache_one; # 指定用于页面缓存的共享内存，对应http层设置的keys_zone
        proxy_cache_valid 200 302 24h; # 为不同的响应状态码设置不同的缓存时间
        proxy_cache_valid 301 30d; # 为不同的响应状态码设置不同的缓存时间
        proxy_cache_valid any 5m; # 为不同的响应状态码设置不同的缓存时间
        expires 90d; # 设置缓存时间
      }
    }


    # 例 - 负载均衡配置
    upstream backend {
      #最小连接数策略: 将请求优先分配给压力较小的服务器
      #least_conn;

      #最快响应时间: 优先分配给响应时间最短的服务器
      #fair;

      #客户端ip绑定: 同一个ip的请求永远只分配一台服务器, 解决动态网页session共享问题
      #ip_hash;

      # weight 设定服务器负载权重(默认是1), backup 备用服务器
      server 10.1.23.43:80599 weight=1;
      server 10.1.23.44:80599 weight=1;
      server 10.1.23.45:80599 weight=1 backup;
    }

    server {
      server_name www.domain.com;
      listen 80;

      location / {
        proxy_pass http://backend;
        #协商缓存 (默认开启，可省略)
        #etag on;
        #if_modified_since exact;

        #强制缓存
        #expires 365d;

        #强制缓存 (推荐)
        #设置Cache-Control "no-cache", 需要进行协商缓存，发送请求到服务器确认是否使用缓存
        #设置Cache-Control "no-store", 禁止使用缓存，每一次都要重新请求数据
        #设置Cache-Control "public", 可以被所有的用户缓存，包括终端用户和CDN中间代理服务器
        #设置Cache-Control "private", 只能被终端用户的浏览器缓存,不允许CDN等中继缓存服务器
        add_header Cache-Control "max-age=31536000"; #缓存一年
      }
    }


    # 例 - 配置 https
    server {
      listen 443 ssl;
      server_name www.domain.com;

      ssl on;
      ssl_certificate /etc/nginx/server.crt;
      ssl_certificate_key /etc/nginx/server.key;
      ssl_session_timeout 5m;

      location / {
        root /usr/local/web/;
        add_header 'Cache-Control' 'no-store';
      }
    }
  }
```

### server

用于指定虚拟主机的域名或 IP 地址。如果一个请求的 Host 头中的值和 server_name 匹配，则 nginx 将会使用该虚拟主机配置处理该请求。

每个 server 块又分为全局 server 块，和一个或多个 location 块。

```conf
  http {
    #指定服务器的IP地址
    server {
      listen 80;
      server_name 192.168.1.100;

      location / {
        root /var/www/html;
      }
    }


    #指定服务器的域名
    server {
      listen 80;
      server_name www.example.com;

      location / {
        root /var/www/html;
      }
    }


    #可以使用正则表达式匹配(需要～, 标志正则表达式)
    #下面可以匹配 www.example.com 和 example.com
    server {
      listen 80;
      server_name ~^(www.)?example.com$;

      location / {
        root /var/www/html;
      }
    }


    #可以使用通配符匹配, 只能用在如下两种情况
    #1.三段字符串组成名称的首段或尾段
    #2.两段字符串组成名称的尾段
    server {
      listen 80;
      server_name *.example.com example.*;

      location / {
        root /var/www/html;
      }
    }
  }
```

### location

用来匹配不同的 url 请求，进而对请求做不同的处理和响应

#### root / alias

```conf
  http {
    server {
      listen 80;
      server_name www.example.com;

      # root (结尾 '/' 可有可无)
      # www.example.com/img1/1.png -> /var/www/html/img1/1.png
      location /img1 {
        root /var/www/html;
      }


      # alias (映射到某个目录, 必须以 '/' 结尾)
      # www.example.com/img2/1.png -> /var/www/html/1.png
      location /img2 {
        alias /var/www/html/;
      }


      # alias (映射到具体文件)
      # www.example.com/img2/1.png -> /var/www/html/1.png
      location ~ ^/img2/1.png$ {
        alias /var/www/html/1.png;
      }
    }
  }
```

#### rewrite

http 请求重定向处理

语法: rewrite regex replacement [flag]

flag:

- redirect: 临时重定向，浏览器根据响应状态 302 和 响应头  Location  跳转对应地址。
- permanent: 永久重定向，浏览器根据响应状态 301 和 响应头  Location  跳转对应地址。当再次访问  www.example.com/to_permanen… 时   不会询问  nginx  直接跳转新地址。
- flag=break: 当访问 www.example.com/to_break/1.… 实际匹配第三个 location，然后在当前上下文处理。其中 /to_break/1.jpg 被替换为 /test/1.jpg 进行处理，然后和 root 指定路径匹配，返回 /var/www/html/to_break/test/1.jpg 数据。
- flag=last: 当访问 www.example.com/to_last/1.p… 实际匹配第四个 location，其中 /to_break/1.jpg 被替换为 /test/1.jpg 去匹配新的 location 进行处理，最终匹配第五个 location，返回 /var/www/html/test/1.jpg 数据。

```conf
  http {
    server {
      listen 80;
      server_name www.example.com;

      #flag=redirect (临时重定向)
      location /to_redirect {
        rewrite ^/to_redirect http://www.google.com redirect;
      }

      #flag=permanent (永久重定向)
      location /to_permanent {
        rewrite ^/to_permanent http://www.google.com permanent;
      }

      #flag=break (停止匹配，在当前 `location` 去搜索资源)
      location /to_break {
        root /var/www/html/to_break;
        rewrite /to_break/(.*) /test/$1 break;
      }

      #flag=last (发送一个新的请求去匹配 location)
      location /to_last {
        root /var/www/html/to_last;
        rewrite /to_last/(.*) /test/$1 last;
      }

      location /test/ {
        root /var/www/html;
      }
    }
  }
```

#### try_files

以指定顺序检查文件是否存在，并使用第一个找到的文件进行请求处理。如果找不到内容内部转发到最后一个参数 uri (获取请求路径中的 path)

需要注意的是，只有最后一个参数可以引起一个内部重定向，之前的参数只设置内部 URI 的指向。最后一个参数是回退 URI 且必须存在，否则会出现内部 500 错误。命名的 location 也可以使用在最后一个参数中。与 rewrite 指令不同，如果回退 URI 不是命名的 location 那么$args不会自动保留，如果你想保留$args，则必须明确声明。

```conf
http {
  server {
    listen 80;
    server_name www.example.com;

    location /try/ {
      root /var/www/html;
      index  index.html;
      try_files $uri $uri/ @proxy_pass;
    }

    location @proxy_pass {
      default_type application/json;
      return 200 "没到到页面代理数据";
    }
  }
}
```

```conf
server {
	listen      80;
	server_name www.example.com;
	root        /data/wwwroot;
	charset     utf-8;
	set         $set_frame_option "true";

	location / {
		expires   -1;
		### x-frame-options START #######
		if ($request_uri ~* "/no-iframe-embed/\d+/?$") {
			set $set_frame_option "false";
		}
		### x-frame-options END #######
		if ($set_frame_option = 'false') {
			rewrite ^(.*) /index.html break;
		}

		try_files $uri $uri/ /index.html;
	}

	location =/index.html {
		expires -1;

		if ($set_frame_option = 'true') {
			add_header X-Frame-Options SAMEORIGIN;
		}
	}
}
```

## url 匹配顺序

1. =: 精准匹配，如果匹配成功，则停止其他匹配
2. ^~和 无符号: 普通匹配，遍历记录所有非正则匹配，选择字符最长的 location 作为匹配, 如果选择的 location 是使用了 ^~ 修饰符，则停止正则匹配
3. 正则表达式指令匹配，按照配置文件里的顺序从上到下进行匹配，如果成功匹配就停止其他匹配
4. 所有正则都未匹配成功，则使用普通字符串匹配结果（最长字符）
