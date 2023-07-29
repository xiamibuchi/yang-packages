# Redis

[官网](https://redis.io/)

Redis 采用的是基于内存的采用的是单进程单线程模型的 KV 数据库，由 C 语言编写，官方提供的数据是可以达到 100000+的 QPS（每秒内查询次数）。

1. 基于内存，绝大部分请求是纯粹的内存操作
2. 采用单线程，避免了不必要的上下文切换和竞争条件，也不存在多进程或者多线程导致的切换而消耗 CPU，不用去考虑各种锁的问题，不存在加锁释放锁操作，没有因为可能出现死锁而导致的性能消耗

## 数据类型

- strings
- lists
- sets
- hashes
- sorted set
- streams
- geospatial indexes
- bitmaps
- bitfields
