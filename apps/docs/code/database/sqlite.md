# sqlite

## init

```shell
# 安装
# Mac 自带 sqlite3
# 创建/进入数据库
sqlite3 test.db;
# 数据库操作
.tables # 显示所有表
CREATE TABLE column_name (column_name1 INTEGER PRIMARY KEY, column_name2 TEXT); # 创建表-主键
CREATE TABLE column_name (column_name1 INTEGER, name TEXT, FOREIGN KEY (column_name2) REFERENCES other_table(primary_key_column)); # 创建表-外键
ALTER TABLE column_name ADD PRIMARY KEY (column_name1); # 修改-主键
UPDATE column_name SET column_name1 = 'new value'; # 修改-值
INSERT INTO column_name(column_name1, column_name2) VALUES (1, name1); # 插入数据
SELECT * FROM column_name; # 查找数据
DELETE FROM table_name WHERE column_name1 = '1'; # 删除-值
DROP TABLE table_name; # 删除-表
```

## 数据类型

- INTEGER：整数
- REAL：浮点数
- TEXT：文本
- BLOB：二进制数据
- NULL：未知