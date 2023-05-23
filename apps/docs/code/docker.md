# docker

[文档](https://docs.docker.com/)

Docker 项目的目标是实现轻量级的操作系统虚拟化解决方案。 Docker 的基础是 Linux 容器（LXC）等技术。

在 LXC 的基础上 Docker 进行了进一步的封装，让用户不需要去关心容器的管理，使得操作更为简便。容器是在操作系统层面上实现虚拟化，直接复用本地主机的操作系统，而传统方式则是在硬件层面实现。

## 安装

```shell
# zsh
brew install podman && echo 'alias docker=podman' >> ~/.zshrc && source ~/.zshrc
# bash
brew install podman && echo 'alias docker=podman' >> ~/.bashrc && source ~/.bashrc
```

## Docker 组件

The Docker Engine – Docker Engine 是一个基于虚拟化技术的轻量级并且功能强大的开源容器引擎管理工具。它可以将不同的 work flow 组合起来构建成你的应用。
Docker Hub 可以分享和管理你的 images 镜像的一个 Saas 服务。

Docker 相比于传统虚拟机的技术来说先进了不少，具体表现在 Docker 不是在宿主机上虚拟出一套硬件后再虚拟出一个操作系统，而是让 Docker 容器里面的进程直接运行在宿主机上（Docker 会做文件、网络等的隔离），这样一来 Docker 会 “体积更轻、跑的更快、同宿主机下可创建的个数更多”。

host 是执行 docker 命令的数组机。daemon 核心程序负责各种操作（下载 docker 镜像、运行容器）
我们通过 client 命令与 daemon 进行交互，由 daemon 进行后续的操作

- 简化配置
- 整合服务器
- 代码流水线管理
- 提高开发效率
- 隔离应用
- 调试能力
- 多租户
- 快速部署

### Image

Docker 中的镜像是分层的，可复用的，而非简单的一堆文件迭在一起（类似于一个压缩包的源码和一个 git 仓库的区别）。

由于 Docker 使用一个统一文件系统，Docker 进程认为整个文件系统是以读写方式挂载的。 但是所有的变更都发生顶层的可写层，而下层的原始的只读镜像文件并未变化。由于镜像不可写，所以镜像是无状态的

所有镜像都是通过一个 64 位十六进制字符串 （内部是一个 256 bit 的值）来标识的。 为简化使用，前 12 个字符可以组成一个短 ID，可以在命令行中使用。短 ID 还是有一定的碰撞机率，所以服务器总是返回长 ID。

可以使用 docker pull 命令来从仓库获取所需要的镜像

### container

容器的存在离不开镜像的支持，他是镜像运行时的一个载体（类似于实例和类的关系）。依托 Docker 的虚拟化技术，给容器创建了独立的端口、进程、文件等“空间”，Container 就是一个与宿机隔离 “容器”。容器可宿主机之间可以进行 port、volumes、network 等的通信。

```shell
# 启动 docker 服务
service docker start

# 搜索 image
docker search <image-name>

# 拉取 image
docker image pull <image-name>

# 删除 image
docker rmi hello-world # 如果镜像曾被执行，你需要 docker rm [containID]

# 显示容器 -a全部 -q只显示container id
docker ps

# 删除所有 container
docker rm $(docker ps -aq)

# 下载 node 镜像,运行一个名为 mynode 的容器，并在容器里运行 /bin/bash
docker run -it --name mynode node /bin/bash

# 下载 node 镜像,运行一个名为 mynode 的容器，并在容器里运行 /bin/bash，并将宿主机上的/data目录挂载到container中的 /data
docker run -it -v /data:/data --name mynode node /bin/bash
# 退出 container
exit

# 终止docker容器
docker container kill [containID]

# 关闭 container
docker stop mynode

# 重启 container
docker start mynode

# 重启后,在mycentos再打开/bin/bash
docker exec -ti mynode /bin/bash

# 查看后台运行的日志
docker logs my_container

# 实时监控(类似tail -f)
docker logs -f my_container

# 获取最后10行
docker logs --tail 10 my_container

# 实时查看最近的日志
docker logs --tail 0 -f my_container

# 加上时间戳
docker logs -t my_container
```

### Repository

Docker 的仓库和 git 的仓库比较相似，拥有仓库名、tag。在本地构建完镜像之后，即可通过仓库进行镜像的分发。常用的 Docker hub 有 https://hub.docker.com/ 、 https://cr.console.aliyun.com/ 等

## 命令小结

| 命令                                                     | 说明                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| docker pull                                              | 获取image                                                    |
| docker build                                             | 创建image                                                    |
| docker images                                            | 列出image                                                    |
| docker run [CONTAINER NAME]                              | 运行container                                                |
| docker container ls                                      | 列出正在运行container                                        |
| docker container ls -a                                   | 列出所有container（终止状态的容器）                          |
| docker container stop [CONTAINER ID]                     | 终止container                                                |
| docker container logs                                    | 获取容器输出信息                                             |
| docker ps                                                | 列出container                                                |
| docker rm                                                | 删除container                                                |
| docker rmi                                               | 删除image                                                    |
| docker exec -it [CONTAINER ID] bash                      | 进入container内部执行命令；不建议使用docker attach命令会在`exit`时终止容器 |
| docker cp [SOURCE PATH] [CONTAINER ID]:/[TARGET PATH]    | 复制文件到容器内部                                           |
| docker commit -m '[MESSAGE]' [CONTAINER ID] [IMAGE NAME] | 保存改动为新 image                                           |

## 容器生命周期管理

### docker run 创建一个新的容器并运行一个命令

语法：`docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`

OPTIONS说明：

- -a stdin: 指定标准输入输出内容类型，可选 STDIN/STDOUT/STDERR 三项；
- -d: 后台运行容器，并返回容器ID；
- -i: 以交互模式运行容器，通常与 -t 同时使用；
- -P: 随机端口映射，容器内部端口随机映射到主机的高端口
- -p: 指定端口映射，格式为：主机(宿主)端口:容器端口
- -t: 为容器重新分配一个伪输入终端，通常与 -i 同时使用；
- --name="nginx-lb": 为容器指定一个名称；
- --dns 8.8.8.8: 指定容器使用的DNS服务器，默认和宿主一致；
- --dns-search example.com: 指定容器DNS搜索域名，默认和宿主一致；
- -h "mars": 指定容器的hostname；
- -e username="ritchie": 设置环境变量；
- --env-file=[]: 从指定文件读入环境变量；
- --cpuset="0-2" or --cpuset="0,1,2": 绑定容器到指定CPU运行；
- -m :设置容器使用内存最大值；
- --net="bridge": 指定容器的网络连接类型，支持 bridge/host/none/container: 四种类型；
- --link=[]: 添加链接到另一个容器；
- --expose=[]: 开放一个端口或一组端口；
- --volume , -v: 绑定一个卷

实例

```
使用docker镜像nginx:latest以后台模式启动一个容器,并将容器命名为mynginx。
$ docker run --name mynginx -d nginx:latest

使用镜像nginx:latest以后台模式启动一个容器,并将容器的80端口映射到主机随机端口。
$ docker run -P -d nginx:latest

使用镜像 nginx:latest，以后台模式启动一个容器,将容器的 80 端口映射到主机的 80 端口,主机的目录 /data 映射到容器的 /data。
$ docker run -p 80:80 -v /data:/data -d nginx:latest

绑定容器的 8080 端口，并将其映射到本地主机 127.0.0.1 的 80 端口上。
$ docker run -p 127.0.0.1:80:8080/tcp ubuntu bash

使用镜像nginx:latest以交互模式启动一个容器,在容器内执行/bin/bash命令。
$ docker run -it nginx:latest /bin/bash
复制代码
```

### docker start/stop/restart 容器运行状态管理

- docker start :启动一个或多个已经被停止的容器
- docker stop :停止一个运行中的容器
- docker restart :重启容器

语法：`docker start/stop/restart [OPTIONS] CONTAINER [CONTAINER...]`

实例

```
启动已被停止的容器mymyname
docker start mymyname

停止运行中的容器mymyname
docker stop mymyname

重启容器mymyname
docker restart mymyname
复制代码
```

### docker kill :杀掉一个运行中的容器。

语法：`docker kill [OPTIONS] CONTAINER [CONTAINER...]`

OPTIONS说明：

- -s :向容器发送一个信号

实例

```
杀掉运行中的容器mynginx
$ docker kill -s KILL mynginx
复制代码
```

### docker rm ：删除一个或多少容器

语法:`docker rm [OPTIONS] CONTAINER [CONTAINER...]`

OPTIONS说明：

- -f :通过SIGKILL信号强制删除一个运行中的容器
- -l :移除容器间的网络连接，而非容器本身
- -v :-v 删除与容器关联的卷

实例

```
强制删除容器db01、db02
docker rm -f db01 db02

移除容器nginx01对容器db01的连接，连接名db
docker rm -l db 

删除容器nginx01,并删除容器挂载的数据卷
docker rm -v nginx01
复制代码
```

### docker pause/unpause ：容器经常运行管理

docker pause :暂停容器中所有的进程。 docker unpause :恢复容器中所有的进程。

语法:`docker pause/unpause [OPTIONS] CONTAINER [CONTAINER...]`

实例

```
暂停数据库容器db01提供服务。
docker pause db01

恢复数据库容器db01提供服务。
docker unpause db01
复制代码
```

### docker create ：创建一个新的容器但不启动它

语法:`docker create [OPTIONS] IMAGE [COMMAND] [ARG...]`

实例

```
使用docker镜像nginx:latest创建一个容器,并将容器命名为mymyname
$ docker create  --name mymyname  nginx:latest
复制代码
```

### docker exec ：在运行的容器中执行命令

语法:`docker exec [OPTIONS] CONTAINER COMMAND [ARG...]`

OPTIONS说明：

- -d :分离模式: 在后台运行
- -i :即使没有附加也保持STDIN 打开
- -t :分配一个伪终端

实例

```
在容器 mynginx 中以交互模式执行容器内 /root/myname.sh 脚本:
$ docker exec -it mynginx /bin/sh /root/myname.sh

在容器 mynginx 中开启一个交互模式的终端:
$ docker exec -i -t  mynginx /bin/bash

也可以通过 docker ps -a 命令查看已经在运行的容器，然后使用容器 ID 进入容器。
查看已经在运行的容器 ID：
$ docker ps -a 
...
9df70f9a0714        openjdk             "/usercode/script.sh…" 
...
第一列的 9df70f9a0714 就是容器 ID。

通过 exec 命令对指定的容器执行 bash:
$ docker exec -it 9df70f9a0714 /bin/bash
复制代码
```

## 容器操作

### docker ps : 列出容器

语法`docker ps [OPTIONS]`

OPTIONS说明：

- -a :显示所有的容器，包括未运行的。
- -f :根据条件过滤显示的内容。
- --format :指定返回值的模板文件。
- -l :显示最近创建的容器。
- -n :列出最近创建的n个容器。
- --no-trunc :不截断输出。
- -q :静默模式，只显示容器编号。
- -s :显示总的文件大小。

实例

```
列出所有在运行的容器信息。
$ docker ps

列出最近创建的5个容器信息。
$ docker ps -n 5

列出所有创建的容器ID。
$ docker ps -a -q
复制代码
```

### docker inspect : 获取容器/镜像的元数据。

语法:`docker inspect [OPTIONS] NAME|ID [NAME|ID...]`

OPTIONS说明：

- -f :指定返回值的模板文件。
- -s :显示总的文件大小。
- --type :为指定类型返回JSON。

实例

```
获取镜像mysql:5.6的元信息。
$ docker inspect mysql:5.6
[{"Id": "sha256:2c0964ec182ae9a045f866bbc2553087f6e42bfc16074a74fb820af235f070ec"
...

获取正在运行的容器mymysql的 IP。
$ docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mymysql
172.17.0.3
复制代码
```

### docker top :查看容器中运行的进程信息，支持 ps 命令参数。

语法:`docker top [OPTIONS] CONTAINER [ps OPTIONS]`

> 容器运行时不一定有/bin/bash终端来交互执行top命令，而且容器还不一定有top命令，可以使用docker top来实现查看container中正在运行的进程。

实例

```
查看容器mymysql的进程信息。
$ docker top mymysql
UID    PID    PPID    C      STIME   TTY  TIME       COMMAND
999    40347  40331   18     00:58   ?    00:00:02   mysqld

查看所有运行容器的进程信息。
for i in  `docker ps |grep Up|awk '{print $1}'`;do echo \ &&docker top $i; done
PID                 USER                TIME                COMMAND
10008               root                0:00                nginx: master process nginx -g daemon off;
10049               101                 0:00                nginx: worker process
复制代码
```

### docker events : 从服务器获取实时事件

语法:`docker events [OPTIONS]`

OPTIONS说明：

- -f ：根据条件过滤事件；
- --since ：从指定的时间戳后显示所有事件;
- --until ：流水时间显示到指定的时间为止；

实例

```
显示docker 2016年7月1日后的所有事件。
$ docker events  --since="1467302400"

显示docker镜像2016年7月1日后的相关事件。
$ docker events -f "image"="mysql:5.6" --since="1467302400" 
复制代码
```

### docker logs : 获取容器的日志

语法:`docker logs [OPTIONS] CONTAINER`

OPTIONS说明：

- -f : 跟踪日志输出
- --since :显示某个开始时间的所有日志
- -t : 显示时间戳
- --tail :仅列出最新N条容器日志

实例

```
跟踪查看容器mynginx的日志输出。
$ docker logs -f mynginx

查看容器mynginx从2016年7月1日后的最新10条日志。
$ docker logs --since="2016-07-01" --tail=10 mynginx
复制代码
```

### docker wait : 阻塞运行直到容器停止，然后打印出它的退出代码。

语法:`docker wait [OPTIONS] CONTAINER [CONTAINER...]`

实例

```
docker wait CONTAINER
复制代码
```

docker export :将文件系统作为一个tar归档文件导出到STDOUT。

语法:`docker export [OPTIONS] CONTAINER`

OPTIONS说明：

- -o :将输入内容写到文件。

实例

```
将id为a404c6c174a2的容器按日期保存为tar文件。
$ docker export -o mysql-`date +%Y%m%d`.tar a404c6c174a2
$ ls mysql-`date +%Y%m%d`.tar
mysql-20191001.tar
复制代码
```

### docker port :列出指定的容器的端口映射

> 列出指定的容器的端口映射，或者查找将PRIVATE_PORT NAT到面向公众的端口。

语法:`docker port [OPTIONS] CONTAINER [PRIVATE_PORT[/PROTO]]`

实例

```
查看容器mynginx的端口映射情况。
$ docker port mymysql
3306/tcp -> 0.0.0.0:3306
复制代码
```

## 容器rootfs命令

### docker commit :从容器创建一个新的镜像。

语法:`docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]`

OPTIONS说明：

- -a :提交的镜像作者；
- -c :使用Dockerfile指令来创建镜像；
- -m :提交时的说明文字；
- -p :在commit时，将容器暂停。

实例

```
将容器a404c6c174a2 保存为新的镜像,并添加提交人信息和说明信息。
$ docker commit -a "myname.com" -m "my apache" a404c6c174a2  mymysql:v1 
sha256:37af1236adef1544e8886be23010b66577647a40bc02c0885a6600b33ee28057

$ docker images mymysql:v1
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
mymysql             v1                  37af1236adef        15 seconds ago      329 MB
复制代码
```

### docker cp :用于容器与主机之间的数据拷贝。

语法`docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-` 或 `docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH`

OPTIONS说明：

- -L :保持源目标中的链接

实例

```
将主机/www/myname目录拷贝到容器96f7f14e99ab的/www目录下。
$ docker cp /www/myname 96f7f14e99ab:/www/

将主机/www/myname目录拷贝到容器96f7f14e99ab中，目录重命名为www。
$ docker cp /www/myname 96f7f14e99ab:/www

将容器96f7f14e99ab的/www目录拷贝到主机的/tmp目录中。
$ docker cp  96f7f14e99ab:/www /tmp/
复制代码
```

### docker diff : 检查容器里文件结构的更改。

语法:`docker diff [OPTIONS] CONTAINER`

实例

```
查看容器mymysql的文件结构更改。
docker diff nginx

C /var
C /var/cache
C /var/cache/nginx
A /var/cache/nginx/uwsgi_temp
A /var/cache/nginx/client_temp
A /var/cache/nginx/fastcgi_temp
A /var/cache/nginx/proxy_temp
A /var/cache/nginx/scgi_temp
C /root
A /root/.bash_history
C /run
A /run/nginx.pid
复制代码
```

## 镜像仓库

### docker login/logout : 登陆/登出到一个Docker镜像仓库

> 如果未指定镜像仓库地址，默认为官方仓库 Docker Hub

语法:`docker login/logout [OPTIONS] [SERVER]`

OPTIONS说明：

- -u :登陆的用户名
- -p :登陆的密码

实例

```
登陆到Docker Hub
docker login -u 用户名 -p 密码

登出Docker Hub
docker logout
复制代码
```

### docker pull : 从镜像仓库中拉取或者更新指定镜像

语法:`docker pull [OPTIONS] NAME[:TAG|@DIGEST]`

OPTIONS说明： -a :拉取所有 tagged 镜像 --disable-content-trust :忽略镜像的校验,默认开启

实例

```
从Docker Hub下载java最新版镜像。
docker pull java

从Docker Hub下载REPOSITORY为java的所有镜像。
docker pull -a java
复制代码
```

### docker push : 将本地的镜像上传到镜像仓库,要先登陆到镜像仓库

语法:`docker push [OPTIONS] NAME[:TAG]`

OPTIONS说明：

- --disable-content-trust :忽略镜像的校验,默认开启

实例

```
上传本地镜像myapache:v1到镜像仓库中。
docker push myapache:v1
复制代码
```

### docker search : 从Docker Hub查找镜像

语法:`docker search [OPTIONS] TERM`

OPTIONS说明：

- --automated :只列出 automated build类型的镜像；
- --no-trunc :显示完整的镜像描述；
- -s :列出收藏数不小于指定值的镜像。

实例

```
从Docker Hub查找所有镜像名包含java，并且收藏数大于10的镜像
$ docker search -s 10 java

Flag --stars has been deprecated, use --filter=stars=3 instead
NAME                              DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
node                              Node.js is a JavaScript-based platform for s…   7932                [OK]                
tomcat                            Apache Tomcat is an open source implementati…   2531                [OK]                
java                              Java is a concurrent, class-based, and objec…   1976                [OK]                
openjdk                           OpenJDK is an open-source implementation of …   1906                [OK]                
ghost                             Ghost is a free and open source blogging pla…   1035                [OK]                
jetty                             Jetty provides a Web server and javax.servle…   315                 [OK]                
couchdb                           CouchDB is a database that uses JSON for doc…   300                 [OK]                
groovy                            Apache Groovy is a multi-faceted language fo…   78                  [OK]                
lwieske/java-8                    Oracle Java 8 Container - Full + Slim - Base…   45                                      [OK]
nimmis/java-centos                This is docker images of CentOS 7 with diffe…   42                                      [OK]
fabric8/java-jboss-openjdk8-jdk   Fabric8 Java Base Image (JBoss, OpenJDK 8)      28                                      [OK]
frekele/java                      docker run --rm --name java frekele/java        12                                      [OK]
复制代码
```

## 本地镜像管理

### docker images : 列出本地镜像。

语法:`docker images [OPTIONS] [REPOSITORY[:TAG]]`

OPTIONS说明：

- -a :列出本地所有的镜像（含中间映像层，默认情况下，过滤掉中间映像层）；
- --digests :显示镜像的摘要信息；
- -f :显示满足条件的镜像；
- --format :指定返回值的模板文件；
- --no-trunc :显示完整的镜像信息；
- -q :只显示镜像ID。

实例

```
查看本地镜像列表。
$ docker images

列出本地镜像中REPOSITORY为ubuntu的镜像列表。

# docker images ubuntu
复制代码
```

### docker rmi : 删除本地一个或多少镜像。

语法`docker rmi [OPTIONS] IMAGE [IMAGE...]`

OPTIONS说明：

- -f :强制删除；
- --no-prune :不移除该镜像的过程镜像，默认移除；

实例

```
强制删除本地镜像 myname/ubuntu:v4。
$ docker rmi -f myname/ubuntu:v4
复制代码
```

### docker tag : 标记本地镜像，将其归入某一仓库。

语法:`docker tag [OPTIONS] IMAGE[:TAG] [REGISTRYHOST/][USERNAME/]NAME[:TAG]`

实例

```
将镜像ubuntu:15.10标记为 myname/ubuntu:v3 镜像。
root@myname:~# docker tag ubuntu:15.10 myname/ubuntu:v3
root@myname:~# docker images   myname/ubuntu:v3
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
myname/ubuntu       v3                  4e3b13c8a266        3 months ago        136.3 MB
复制代码
```

### docker build 命令用于使用 Dockerfile 创建镜像。

语法:`docker build [OPTIONS] PATH | URL | -`

OPTIONS说明：

- --build-arg=[] :设置镜像创建时的变量；
- --cpu-shares :设置 cpu 使用权重；
- --cpu-period :限制 CPU CFS周期；
- --cpu-quota :限制 CPU CFS配额；
- --cpuset-cpus :指定使用的CPU id；
- --cpuset-mems :指定使用的内存 id；
- --disable-content-trust :忽略校验，默认开启；
- -f :指定要使用的Dockerfile路径；
- --force-rm :设置镜像过程中删除中间容器；
- --isolation :使用容器隔离技术；
- --label=[] :设置镜像使用的元数据；
- -m :设置内存最大值；
- --memory-swap :设置Swap的最大值为内存+swap，"-1"表示不限swap；
- --no-cache :创建镜像的过程不使用缓存；
- --pull :尝试去更新镜像的新版本；
- --quiet, -q :安静模式，成功后只输出镜像 ID；
- --rm :设置镜像成功后删除中间容器；
- --shm-size :设置/dev/shm的大小，默认值是64M；
- --ulimit :Ulimit配置。
- --tag, -t: 镜像的名字及标签，通常 name:tag 或者 name 格式；可以在一次构建中为一个镜像设置多个标签。
- --network: 默认 default。在构建期间设置RUN指令的网络模式

实例

```
使用当前目录的 Dockerfile 创建镜像，标签为 myname/ubuntu:v1。
$ docker build -t myname/ubuntu:v1 . 

使用URL github.com/creack/docker-firefox 的 Dockerfile 创建镜像。
$ docker build github.com/creack/docker-firefox

也可以通过 -f Dockerfile 文件的位置：
$ docker build -f /path/to/a/Dockerfile .

在 Docker 守护进程执行 Dockerfile 中的指令前，首先会对 Dockerfile 进行语法检查，有语法错误时会返回：
$ docker build -t test/myapp .
复制代码
```

### docker history : 查看指定镜像的创建历史。

语法:`docker history [OPTIONS] IMAGE`

OPTIONS说明：

- -H :以可读的格式打印镜像大小和日期，默认为true；
- --no-trunc :显示完整的提交记录；
- -q :仅列出提交记录ID。

实例

```
查看本地镜像myname/ubuntu:v3的创建历史。
$ docker history myname/ubuntu:v3
复制代码
```

### docker save : 将指定镜像保存成 tar 归档文件。

语法:`docker save [OPTIONS] IMAGE [IMAGE...]`

OPTIONS 说明：

- -o :输出到的文件。

实例

```
将镜像 myname/ubuntu:v3 生成 my_ubuntu_v3.tar 文档
$ docker save -o my_ubuntu_v3.tar myname/ubuntu:v3
复制代码
```

### docker load : 导入使用 docker save 命令导出的镜像。

语法:`docker load [OPTIONS]`

OPTIONS 说明：

- --input , -i : 指定导入的文件，代替 STDIN。
- --quiet , -q : 精简输出信息。

实例

```
导入镜像：
$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE

$ docker load < busybox.tar.gz
Loaded image: busybox:latest

$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
busybox             latest              769b9341d937        7 weeks ago         2.489 MB

$ docker load --input fedora.tar
Loaded image: fedora:rawhide
Loaded image: fedora:20
复制代码
```

### docker import : 从归档文件中创建镜像。

语法:`docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]`

OPTIONS说明：

- -c :应用docker 指令创建镜像；
- -m :提交时的说明文字；

实例

```
从镜像归档文件my_ubuntu_v3.tar创建镜像，命名为myname/ubuntu:v4
$ docker import  my_ubuntu_v3.tar myname/ubuntu:v4  
sha256:63ce4a6d6bc3fabb95dbd6c561404a309b7bdfc4e21c1d59fe9fe4299cbfea39
复制代码
```

## 其他

- docker info : 显示 Docker 系统信息，包括镜像和容器数。
- docker version :显示 Docker 版本信息

## Dockerfile创建镜像

### Dockerfile实例

```shell
FROM alpine:latest # FROM baseimage
MAINTAINER sbf # 共享是告诉其他人，是谁写的
CMD echo 'hello docker' # 运行命令
```

### 实际操作

```shell
touch Dockerfile
vim Dockerfile

docker build -t hello_docker .      // -t 构建image名  . 当前目录下所有内容都提交给docker产生image
docker images hello_docker          // 查看image 是否生成
docker run hello_docker             // 运行image, 输出内容 hello docker
```

### 复杂一点的实例

```
FROM ubuntu
MAINTAINER xbf
RUN sed -i 's/archive.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y nginx
COPY index.html /var/www/html
ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
EXPOSE 80
```

### Dockerfile语法小结

| 语法       | 说明                                    |
| ---------- | --------------------------------------- |
| FROM       | 基础镜像                                |
| RUN        | 容器内执行命令                          |
| CMD        | 程序入口，像main方法一样                |
| ENTRYPOINT | 如果指定，CMD会变为它的arguments        |
| ADD        | 可以添加远程文件，如ftp文件，比copy强大 |
| COPY       | 拷贝文件                                |
| WORKDIR    | 工作目录                                |
| MAINTAINER | 作者                                    |
| ENV        | 设置容器内环境变量                      |
| USER       | 执行命令的用户，一般是非root            |
| VOLUME     | 挂在卷                                  |
| EXPOSE     | 暴露端口                                |

## Volume

### 简介

之前我们知道，我们再容器中的改动默认是不会被保存的，需要`docker commit`提交更新image
 而volume提供方便持久化的存储，并且volume可用于容器与容器间的数据共享

### Docker默认映射数据卷

```
docker run -d --name nginx -v /usr/share/nginx/html nginx
docker inspect nginx            // 检查，列表容器的所有信息
复制代码
```

这里我们关心得是`Mounts`部分

```
{"Mounts": [
     {
         "Type": "volume",
         "Name": "e9484a423cea196a0646fd3570caa3c029724c80b5861479a2429e1854be1225",
         "Source": "/var/lib/docker/volumes/e9484a423cea196a0646fd3570caa3c029724c80b5861479a2429e1854be1225/_data",
         "Destination": "/usr/share/nginx/html",
         "Driver": "local",
         "Mode": "",
         "RW": true,
         "Propagation": ""
     }
]}
复制代码
```

表示将机器路径`/var/lib/docker/volumes/e9484a423cea196a0646fd3570caa3c029724c80b5861479a2429e1854be1225/_data`挂载到容器`/usr/share/nginx/html`
 进机器看看：

```
sudo ls /var/lib/docker/volumes/e9484a423cea196a0646fd3570caa3c029724c80b5861479a2429e1854be1225/_data
复制代码
```



![img](https://user-gold-cdn.xitu.io/2019/9/30/16d820653bdf7f8c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



进入容器内看看:

```
docker exec -it nginx bash
ls /usr/share/nginx/html
复制代码
```



![img](https://user-gold-cdn.xitu.io/2019/9/30/16d82087bef587f1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

上下对应



### 指定本机路径映射数据卷

```
docker run -p 8080:80 -d -v $PWD/html:/usr/share/nginx/html nginx   // 当前目录下html文件夹指向 容器文件夹/var/www/html

cd $PWD/html
复制代码
```

新建文件 index.html

```
vim index.html
this is new path: /Users/XXX/Dev/workplace/docker/test/dockerfile2/html

// 测试 curl  http://localhost:8080/
复制代码
```

### 创建 数据容器 挂靠在 其他容器

```
docker create -v $PWD/data:/var/mydata --name data_container ubuntu 
docker run -it --volumes-from data_container ubuntu bash                // --volumes-from 数据区来源于； ubuntu 基础镜像
复制代码
```

进入容器命令行输入`mount`，你会找到`/var/mydata`

`exit`退出，如`$PWD/data`下出现`index.html`证明挂载成功
以上方式，可以实现多容器数据同步

## docker网络

### 简介

网络是为了实现容器间或容器与外接进行通信，Docker提供了6种网络模式来解决不同场景下的连接方案: `bridge`、`host`、`overlay`、`macvlan`、`none`、`network plugin`。

### 根据不同场景选择网络

- 当需要Docker主机隔离时主机网络最佳的解决方案。
- 当需要跨Docker主机实现网络互联时覆盖网络是最佳选择。
- 当您从大流量需要像物理网卡性能工作时Macvlan网络最佳选择，每个主机都具有唯一的MAC地址。第三方网络插件允许您将Docker与专用网络堆栈集成。

### bridge

bridge模式是默认容器启动默认分配的网络方式，容器使用独立的网络命名空间(namespace)，并连接到docker0虚拟网卡上。

### host

host模式是容器与Docker主机共享同一网络命名空间(namespace)，Docker主机的网络协议栈、路由表、iptables规则、网卡、IP、端口等等都是共享的。容器跟宿主机都在同一网络视图下。这个模式很好的解决了容器与外界通信地址转换的问题，可以直接使用宿主机的IP进行通信，那么这里的网络流量和压力走的都是宿主机的网卡，性能会比较高。不过这个有风险，因为容器跟宿主机是共享一套网络机制，没有隔离。那么会引起网络资源与宿主机的竞争和冲突关系。规模小的场景，可以使用这种模式。主机网络驱动程序仅适用于Linux主机，不支持Windows及Mac平台。

### overlay

overlay模式是多个Docker主机之间的分布式网络解决方案。该网络位于特定于主机的网络之上，允许连接到它的容器（包括群集服务容器）安全地进行通信。Docker透明地处理每个数据包与Docker守护程序主机和正确的目标容器之间正确的的路由。

### macvlan

macvlan跟overlay一样也是跨主机互联的驱动方案。在某些大流量或性能要求较高的场景下，希望直接连接到物理网络，在这种情况下，您可以使用macvlan网络驱动程序为每个容器的虚拟网络接口分配MAC地址，使其看起来像是直接连接到物理网络的物理网络接口。

### none

none模式用于完全禁用容器上的网络堆栈，容器单独使用一个网络命名空间（namespace），仅创建回环设备，如果需要容器连接其他网络，则需要手动进行网络相关的设置，灵活性最高但也是最复杂。

### 插件网络

以上五种驱动都是docker原生提供的，如果以上五种不能满足你的要求，除了原生提供，还支持第三方的驱动模式接入。比如常用的 flannel、pipework、weave 和 calico 等等。

## Docker network管理命令

### 显示网络列表

docker network ls



![img](https://user-gold-cdn.xitu.io/2019/10/10/16db33ddf0875939?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 创建网络

docker network create  

- --config-from 复制其他网络配置

- --driver 指定网络模式

- --gateway 指定网关

- --internal 限制只能内部访问

- --ip-range 从子网范围分配容器IP

- --ipv6 启用IPv6网络

- --subnet 指定网段

  ![img](https://user-gold-cdn.xitu.io/2019/10/10/16db33e0a023d33b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 配置容器连接到指定的网络

docker network connect   

![img](https://user-gold-cdn.xitu.io/2019/10/10/16db33eae3747c40?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 取消容器连接到指定的网络

docker network disconnect   

![img](https://user-gold-cdn.xitu.io/2019/10/10/16db33fb0e9aa90f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 查看网络详情

docker network inspect 

![img](https://user-gold-cdn.xitu.io/2019/10/10/16db33fe176fd4d7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 删除网络

docker network rm 

![img](https://user-gold-cdn.xitu.io/2019/10/10/16db34016dba4470?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 清理未使用的网络

docker network prune

![img](https://user-gold-cdn.xitu.io/2019/10/10/16db3403beed9f93?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 启动容器时指定网络

docker run -it  --network=  ![img]()

![img](https://user-gold-cdn.xitu.io/2019/10/10/16db3406e2587052?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 采用网络名称进行通讯

docker network create lamp-network

docker run -it  --network lamp-network --network-alias apache centos:latest

docker run -it  --network lamp-network --network-alias php centos:latest

docker run -it  --network lamp-network --network-alias mysql centos:latest

![img](https://user-gold-cdn.xitu.io/2019/10/10/16db340bce16003f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 先让它跑起来

首先，简单介绍一下一个典型的前端应用部署流程

1. `npm install`, 安装依赖
2. `npm run build`，编译，打包，生成静态资源
3. 服务化静态资源，如 nginx

介绍完部署流程后，简单写一个 Dockerfile

```
FROM node:10-alpine

# 代表生产环境
ENV PROJECT_ENV production

# 许多 package 会根据此环境变量，做出不同的行为
# 另外，在 webpack 中打包也会根据此环境变量做出优化，但是 create-react-app 在打包时会写死该环境变量
ENV NODE_ENV production

WORKDIR /code
ADD . /code
RUN npm install && npm run build && npm install -g http-server
EXPOSE 80

CMD http-server ./public -p 80
复制代码
```

现在这个前端服务已经跑起来了，接下来你可以完成部署的其它阶段了。

一般情况下，以下就成了运维的工作了，不过，拓展自己的知识边界总是没错的。其它阶段介绍如下

- 使用 `nginx` 或者 `traefik` 做反向代理。在我内部集群中使用了 `traefik`，详见 [traefik 简易入门](https://github.com/shfshanyue/op-note/blob/master/traefik.md)
- 使用 `kubernetes` 或者 `docker compose` 做容器编排。在我内部集群中使用了 `compose`，详见 [docker compose 简易入门](https://github.com/shfshanyue/op-note/blob/master/traefik-compose.md)
- 使用 `gitlab ci`，`drone ci` 或者 `github actions` 等做 CI/CD 自动部署。在我内部集群中使用了 `github actions`，详见 [github actions 简易入门](https://github.com/shfshanyue/op-note/blob/master/github-action-guide.md)

这时镜像存在两个问题，导致每次部署时间过长，不利于产品的快速交付，没有快速交付，也就没有敏捷开发 (Agile)

- 构建镜像时间过长
- 构建镜像大小过大，多时甚至 1G+

## 利用镜像缓存

我们注意到，相对于项目的源文件来讲，`package.json` 是相对稳定的。如果没有新的安装包需要下载，则再次构建镜像时，无需重新构建依赖。则可以在 npm install 上节省一半的时间。

对于 `ADD` 来讲，如果需要添加的文件内容的 `checksum` 没有发生变化，则可以利用缓存。把 `package.json/package-lock.json` 与源文件分隔开写入镜像是一个很好的选择。目前，如果没有新的安装包更新的话，可以节省一半时间

```
FROM node:10-alpine

ENV PROJECT_ENV production
ENV NODE_ENV production

# http-server 不变动也可以利用缓存
RUN npm install -g http-server

WORKDIR /code

# 首次添加此两个文件，充分利用缓存
ADD package.json package-lock.json /code
RUN npm install --production

ADD . /code
RUN npm run build
EXPOSE 80

CMD http-server ./public -p 80
复制代码
```

关于利用缓存有更多细节，需要特别注意一下。如 `RUN git clone `，如果命令字符串没有更新，则将使用缓存，当命令是非幂等性时，这将有可能导致问题。

> 关于缓存及可能导致的问题，可以参考我的文章 [Dockerfile 最佳实践](https://shanyue.tech/op/dockerfile-practice.html#充分利用构建缓存)

## CI 环境下的优化

```
FROM node:10-alpine

ENV PROJECT_ENV production
ENV NODE_ENV production

# http-server 不变动也可以利用缓存
RUN npm install -g http-server

WORKDIR /code

# 首次添加此两个文件，充分利用缓存
ADD package.json package-lock.json /code
RUN npm ci

ADD . /code
RUN npm run build
EXPOSE 80

CMD http-server ./public -p 80
复制代码
```

在 CI 环境下主要做了一点改动：使用 `npm ci` 代替 `npm i`，经实验，`npm ci` 可以减少将近一半的的依赖安装时间。

```
$ npm install
added 1154 packages in 60s

$ npm ci
added 1154 packages in 35s
复制代码
```

另外，当 `package.json` 与 `package-lock.json` 版本不匹配时，`npm ci` 将会报出异常，提前检测出不安全信息，及早发现问题，及早解决问题。

## 多阶段构建

得益于缓存，现在镜像构建时间已经快了不少。但是，此时镜像的体积依旧过于庞大，这也将会导致部署时间的加长。原因如下

考虑下每次 CI/CD 部署的流程

1. 在构建服务器 (Runer) 构建镜像
2. 把镜像推至镜像仓库服务器
3. 在生产服务器拉取镜像，启动容器

显而易见，镜像体积过大会在前两步上传及下载时造成传输效率低下，增加每次部署的延时。

即使，构建服务器与生产服务器在同一节点下，没有延时的问题 (基本没可能)。减少镜像体积也能够节省磁盘空间。

关于镜像体积的过大，完全是因为node_modules 臭名昭著的体积:



![node_modules的体积](https://user-gold-cdn.xitu.io/2020/3/10/170c1e528b0fdb15?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



但最后我们只需要构建生成的静态资源，对于源文件以及 `node_modules` 下文件，占用体积过大且不必要，造成浪费。

此时可以利用 Docker 的多阶段构建，仅来提取编译后文件，即打包生成的静态资源，对 Dockerfile 做一改进

```
FROM node:10-alpine as builder

ENV PROJECT_ENV production
ENV NODE_ENV production

# http-server 不变动也可以利用缓存
WORKDIR /code

ADD package.json package-lock.json /code
RUN npm ci

ADD . /code
RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:10-alpine
COPY --from=builder /code/public /usr/share/nginx/html
复制代码
```

此时，镜像体积从 1G+ 变成了 50M+。若此时的部署仅仅是在测试环境或者多分支环境下为了方便测试，那就大功告成，完美解决问题了。

## 使用对象存储服务 (OSS)

分析一下 50M+ 的镜像体积，`nginx:10-alpine` 的镜像是16M，剩下的40M是静态资源。生产环境的静态资源往往会在独立域名上维护，并使用 CDN 进行加速。

**如果把静态资源给上传到文件存储服务，即OSS，并使用 CDN 对 OSS 进行加速，则没有必要打入镜像了。而在生产环境下也有对静态资源上 CDN 的强烈需求。**

此时镜像大小会控制在 20M 以下。虽然极大地减小了镜像体积，但是它会增加复杂度与增加镜像构建时间(如上传到OSS)，对于测试环境或者分支环境没必要使用 OSS。

关于静态资源，可以分类成两部分：

- `/build`，此类文件在项目中使用 require/import 引用，会被 webpack 打包并加 hash 值，并通过 publicPath 修改资源地址。可以把此类文件上传至 oss，并加上永久缓存，不需要打入镜像
- `/static`，此类文件在项目中直接引用根路径，直接打入镜像，如果上传至 OSS 可能增加复杂度 (批量修改 publicPath)

此时通过一个脚本命令 `npm run uploadOss`，来把静态资源上传至 OSS。更新后的 Dockerfile 如下

```
FROM node:10-alpine as builder

ENV PROJECT_ENV production
ENV NODE_ENV production

# http-server 不变动也可以利用缓存
WORKDIR /code

ADD package.json package-lock.json /code
RUN npm ci

ADD . /code

# npm run uploadOss 是把静态资源上传至 oss 上的脚本文件
RUN npm run build && npm run uploadOss

# 选择更小体积的基础镜像
FROM nginx:10-alpine
COPY --from=builder code/public/index.html code/public/favicon.ico /usr/share/nginx/html/
COPY --from=builder code/public/static /usr/share/nginx/html/static
复制代码
```

## 小结

经过本篇文章总结，在前端中构建镜像需要注意以下几点

1. 镜像中使用基于 `alpine` 的镜像，减小镜像体积。
2. 镜像中需要锁定 `node` 的版本号，尽可能也锁定 `alpine` 的版本号，如 `node:10.19-alpine3.11`。(我示例代码中未如此详细地指出)
3. 选择合适的环境变量 `NODE_ENV` 及 `PROJECT_ENV`，如在测试环境下进行构建
4. npm ci 替代 npm i，避免版本问题及提高依赖安装速度
5. package.json 单独添加，充分利用镜像缓存
6. 使用多阶段构建，减小镜像体积
7. 如有必要，静态资源请上 CDN

## Kubernetes

ENTRYPOINT

```dockerfile
FROM ubuntu:18.04
RUN apt-get update \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*
ENTRYPOINT [ "curl", "-s", "http://myip.ipip.net" ]
```

1. 可以接受外部传参数
2. 应用运行前的准备工作