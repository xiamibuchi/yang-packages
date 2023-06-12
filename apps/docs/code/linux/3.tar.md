# tar

-c: 建立压缩档案
-x：解压
-t：查看内容
-r：向压缩归档文件末尾追加文件
-u：更新原压缩包中的文件

这五个是独立的命令，压缩解压都要用到其中一个，可以和别的命令连用但只能用其中一个。下面的参数是根据需要在压缩或解压档案时可选的。

-z：有 gzip 属性的
-j：有 bz2 属性的
-Z：有 compress 属性的
-v：显示所有过程
-O：将文件解开到标准输出

下面的参数-f 是必须的

-f: 使用档案名字，切记，这个参数是最后一个参数，后面只能接档案名。

# tar -cf all.tar \*.jpg

这条命令是将所有.jpg 的文件打成一个名为 all.tar 的包。-c 是表示产生新的包，-f 指定包的文件名。

# tar -rf all.tar \*.gif

这条命令是将所有.gif 的文件增加到 all.tar 的包里面去。-r 是表示增加文件的意思。

# tar -uf all.tar logo.gif

这条命令是更新原来 tar 包 all.tar 中 logo.gif 文件，-u 是表示更新文件的意思。

# tar -tf all.tar

这条命令是列出 all.tar 包中所有文件，-t 是列出文件的意思

# tar -xf all.tar

这条命令是解出 all.tar 包中所有文件，-t 是解开的意思

压缩

tar -cvf jpg.tar \*.jpg //将目录里所有 jpg 文件打包成 jpg.tar

tar -czf jpg.tar.gz \*.jpg //将目录里所有 jpg 文件打包成 jpg.tar 后，并且将其用 gzip 压缩，生成一个 gzip 压缩过的包，命名为 jpg.tar.gz

tar -cjf jpg.tar.bz2 \*.jpg //将目录里所有 jpg 文件打包成 jpg.tar 后，并且将其用 bzip2 压缩，生成一个 bzip2 压缩过的包，命名为 jpg.tar.bz2

tar -cZf jpg.tar.Z \*.jpg //将目录里所有 jpg 文件打包成 jpg.tar 后，并且将其用 compress 压缩，生成一个 umcompress 压缩过的包，命名为 jpg.tar.Z

rar a jpg.rar \*.jpg //rar 格式的压缩，需要先下载 rar for linux

zip jpg.zip \*.jpg //zip 格式的压缩，需要先下载 zip for linux

解压

tar -xvf file.tar //解压 tar 包

tar -xzvf file.tar.gz //解压 tar.gz

tar -xjvf file.tar.bz2 //解压 tar.bz2

tar -xZvf file.tar.Z //解压 tar.Z

unrar e file.rar //解压 rar

unzip file.zip //解压 zip

总结

1、\*.tar 用 tar -xvf 解压

2、\*.gz 用 gzip -d 或者 gunzip 解压

3、_.tar.gz 和_.tgz 用 tar -xzf 解压

4、\*.bz2 用 bzip2 -d 或者用 bunzip2 解压

5、\*.tar.bz2 用 tar -xjf 解压

6、\*.Z 用 uncompress 解压

7、\*.tar.Z 用 tar -xZf 解压

8、\*.rar 用 unrar e 解压

9、\*.zip 用 unzip 解压

```shell
# 压缩
tar -jcv -f filename.tar.bz2 要被处理的文件或目录名称
# 查询
tar -jtv -f filename.tar.bz2
# 解压
tar -jxv -f filename.tar.bz2 -C 欲解压缩的目录
```
