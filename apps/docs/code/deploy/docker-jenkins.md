# 自动化部署

目标：实现博客的快速部署和迁移。

## Docker 实现构建、启动服务

Docker 是实现轻量级的操作系统虚拟化解决方案。对开发者来说，可以不用关心容器的容器的管理，并且和虚拟机不同，容器直接服用了本地操作系统，性能更好。

安装可参考[文档](https://docs.docker.com/)，有详细的教程。

### Docker 镜像

对前端来说，环境中需要的最基本服务是 nginx(或者 apache 等)，如果有编译、ssr 等需求，还需要 Node。

Docker 可以根据 Dockerfile 生成镜像，镜像类似系统安装包。

### 多阶段构建

在 17.05 版本之前的 Docker，只允许 Dockerfile 中出现一个 FROM 指令，是因为 Docker 的各个层是有相关性的，在联合挂载的过程中，系统需要知道在什么样的基础上再增加新的文件。那么这就要求一个 Docker 镜像只能有一个起始层。
而 17.05 之后，Docker 支持多个 FROM 指令，多个 FROM 指令并不是为了生成多根的层关系，最后生成的镜像，仍以最后一条 FROM 为准，之前的 FROM 会被抛弃。每一条 FROM 指令都是一个构建阶段，多条 FROM 就是多阶段构建，虽然最后生成的镜像只能是最后一个阶段的结果，但是，能够将前置阶段中的文件拷贝到后边的阶段中。所以 Dockerfile 可以先完成构建流程，再完成启动服务：

```dockerfile
# stretch 包含了 yarn 命令
FROM node:12.19.0-stretch AS builder
# 指定工作目录
WORKDIR /app
# 添加依赖文件，分步安装可以在文件不变时利用缓存
ADD package.json /app
ADD yarn.lock /app
# 安装依赖
RUN yarn

ADD . /app
# 编译
RUN yarn build

FROM nginx
# 拷贝第一阶段的编译结果至nginx的默认目录，也能写成--from=0
COPY --from=builder /app/dist /usr/share/nginx/html
RUN nginx
# 暴露80端口
EXPOSE 80
```

完成了 Dockerfile，要根据 Dockerfile 生成镜像。

```bash
# 生成镜像
docker build -t $DOCKER_IMAGE_NAME .
# 根据镜像生成容器在后台运行
docker run --name $DOCKER_CONTAINER_NAME -p 8080:80 -d $DOCKER_IMAGE_NAME
```

上面的命令执行后，宿主机的 8080 端口就是实际博客地址（例如http://127.0.0.1:8080）

如果不希望实际访问时端口号为 80，可以用 nginx 反向代理：

```nginx
server {
  listen       80;
  server_name  Domain;

  location / {
    proxy_pass http://127.0.0.1:8080;
  }
}
```

那么实际访问地址就是 Domain 了。

Docker 实现了编译、迁移等流程的一体化，不受宿主机的限制，然而仍然要去服务器上手动执行。为了进一步简化部署流程，我们需要引入 CI 工具，这里我们选用 jenkins

## Jenkins 自动化

Jenkins 是一款以插件化的方式实现 CI/CD 的软件。

### 安装

安装 jenkins 依赖 jdk，所以安装流程如下：

```bash
sudo apt update
# 安装 jdk
sudo apt install default-jdk
sudo apt-get update

wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
# 在/etc/apt/sources.list文件中添加如下内容：deb https://pkg.jenkins.io/debian-stable binary/

# 安装 jenkins
sudo apt-get install jenkins

# 开机启动
systemctl enable jenkins
```

jenkins 默认端口为 8080，访问 IP:8080 按提示操作即可。

### 执行脚本

新建 jenkins 任务，在“构建部分”添加“执行 shell”，填入需要执行的脚本即可。

```bash
# 如果没有项目则重新拉取
if [ ! -d "./$PROJ_DIR" ]; then
  git clone https://github.com/xiamibuchi/blog.git $PROJ_DIR
fi

cd $PROJ_DIR

# 获取最新代码
git fetch
git pull

# 生成 Docker image
docker build -t $DOCKER_NAME .
# 停止旧的 container
docker stop $DOCKER_NAME
# 删除旧的 container
docker rm $DOCKER_NAME
# 根据最新 image 启动 container
docker run --name $DOCKER_NAME -p 2333:80 -d $DOCKER_NAME
```

这样构建流程只需要执行 Jenkins 任务即可。

> Jenkins 在 shell 脚本运行 docker 权限可能有问题，只需将 jenkins 用户加入 docker 组即可。
> `sudo gpasswd -a jenkins docker`

## webhook 触发 Jenkins 任务

完成上面的流程后仍需手动触发脚本，如何在代码更新时就自动构建呢。可以利用 github 的 webhook。

进入 github 项目，setting 设置好。再进入 Jenkins 中配置 github 相关即可。
