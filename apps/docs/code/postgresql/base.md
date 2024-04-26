# postgresql

## 初始化

```shell
brew info postgresql # get execute command，“brew services start postgresql@14”
brew services start postgresql@14
```

## 常用命令

```shell
createdb [dbname]
dropdb [dbname]
psqd [dbname]

# after access db
SELECT version();
SELECT current_date;
SELECT 2 + 2;
\h # get help
\q # exit

CREATE DATABASE test;


```
