# Redis

[官网](https://redis.io/)

Redis 采用的是基于内存的采用的是单进程单线程模型的 KV 数据库，由 C 语言编写，官方提供的数据是可以达到 100000+的 QPS（每秒内查询次数）。

1. 基于内存，绝大部分请求是纯粹的内存操作
2. 采用单线程，避免了不必要的上下文切换和竞争条件，也不存在多进程或者多线程导致的切换而消耗 CPU，不用去考虑各种锁的问题，不存在加锁释放锁操作，没有因为可能出现死锁而导致的性能消耗

## init

```shell
# install
brew install redis
# run
redis-server
# run background
brew services start redis
# info
brew services info redis
# stop
brew services stop redis
# connect
redis-cli
```

## 数据持久

- RDB：是在指定的时间间隔内将内存中的数据通过异步生成数据快照并且保存到磁盘中
- AOF：相对于RDB方式，AOF方式的持久化更细粒度，把每次数据变化（写、删除操作）都记录AOF文件中，其中AOF又可以配置为 always 即实时将记录写到AOF文件中，everysec每隔一秒将记录写到AOF文件中，no由系统决定何时将记录写到AOF文件中

## 数据类型

- String
- List
- Set
- Hash
- Sorted Set
- streams
- geospatial indexes
- bitmaps
- bitfields

## 集群

主从
