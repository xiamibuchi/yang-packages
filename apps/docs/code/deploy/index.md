# 部署

## 例子

- [docker + jenkins](/code/deploy/docker-jenkins)
- [github](/code/deploy/github)

## 部署流程

- git 拉取最新代码
- lint/test，也可以在 merge/rebase 前做
- build
- 集群部署
- 健康检查，保证服务可用

### 资源缓存

- index.html 一般设置`no-cache`，用于更新资源
- 静态资源带 hash，上传至 cdn
- 服务器内存缓存
- redis

一般的前段部署并不需要服务器缓存和 redis，但是如果存在 ssr 或者简单 ssg 的项目，就可以减少服务器压力

### 负载均衡和滚动发布

这一部分我也只是知道概念，实际工作中负载均衡和滚动发布的实际实现方实际是云服务商。如果让我自己实现的话：

- 查看集群内各 pod 的连接情况，选择流量较少的 pod，暂不接受新连接，将流量打到其他 pod。
- 部署新 pod，替换该旧 pod
- 逐步替换旧 pod，替换完成后，部署完成。

> 更深一步思考，如果部署了 websocket 或者 event-stream，在连接没有断开时，如果考虑用户连接不断开，该如果处理？

### 监控和日志

这里指是服务运行情况的监控，不论是统一用云服务商提供的方案还是自建，都要保证：

- 能实时查看服务运行情况，性能占用
- 在 error、500、404 时有对应的告警机制。

### 回滚

保留旧 pod，将流量打到旧 pod 上即可。此时应该禁止上线 CI 的处罚。