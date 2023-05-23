# git

常见的版本控制系统有：git（分布式）、svn（集中式）

[官网](https://git-scm.com/)

## githooks

[githooks](https://git-scm.com/docs/githooks)

常用的 hook 有：

- pre-commit：git commit 前运行，用于检查即将提交的快照。如代码风格检查、单元测试
- commit-msg：校验 commit message

## Fast-Forward

当前分支合并到另一分支时，如果没有其它分支混合，就会直接移动文件指针。这个过程叫做 fastforward。

开发一直在 master 分支进行，但忽然有一个新的想法，于是新建了一个 develop 的分支，并在其上进行一系列提交，完成时，回到 master 分支，此时，master 分支在创建 develop 分支之后并未产生任何新的 commit。此时的合并就叫 fast forward。

示例：

1. 新建一个 work tree，在 master 中做几次 commit
2. 新建 develop 的 branch，然后再做多次 commits

此时的分支流图如下(gitx)：

正常合并

```
(master)$ git merge develop
Updating 5999848..7355122
Fast-forward
c.txt | 1 +
d.txt | 1 +
2 files changed, 2 insertions(+), 0 deletions(-)
create mode 100644 c.txt
create mode 100644 d.txt
```

可以看出这是一次 fast-forward 式的合并，且合并完之后的视图为扁平状。

使用 –no-ff 进行合并

—no-ff (no fast foward)，使得每一次的合并都创建一个新的 commit 记录。即使这个 commit 只是 fast-foward，用来避免丢失信息。

```
(master)$ git merge –no-ff develop
Merge made by recursive.
c.txt | 2 +-
d.txt | 2 +-
2 files changed, 2 insertions(+), 2 deletions(-)
```

可以看出，使用 no-ff 后，会多生成一个 commit 记录，并强制保留 develop 分支的开发记录（而 fast-forward 的话则是直接合并，看不出之前 Branch 的任何记录）。这对于以后代码进行分析特别有用，故有以下最佳实践。

–no-ff，其作用是：要求 git merge 即使在 fast forward 条件下也要产生一个新的 merge commit。此处，要求采用–no-ff 的方式进行分支合并，其目的在于，希望保持原有“develop branches”整个提交链的完整性。

## .gitignore

- 在仓库的根目录创建一个`.gitignore`的文件，文件名是固定的。
- 将不需要被 git 管理的文件路径添加到`.gitignore`中

> 某些文件加入忽略规则但未生效，原因`.gitignore` 只能忽略没有被追踪的文件，如果某些文件已经被纳入了版本管理中，则修改 `.gitignore` 是无效的。
> 解决方法：就是先把本地缓存删除（改变成未被追踪状态），再提交

```shell
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```

## 常用命令

```shell
git config user.name [username]
git config user.email [email]

# --global，配置全局参数
git config --global user.name [username]
git config --global user.email [email]

# show config
git config --list
# show config and file info
git config --list --show-origin

# 初始化仓库
git init

# 查看状态
git status

# 从工作区添加到暂存区
git add .
git add --all
git add a.text dir/

# 从暂存区提交到仓库区
git commit -m 'commit message'

# 日志
git log
# 显示最近的两个提交记录
git log --pretty=oneline --max-count=2

git log --pretty=oneline --since='5 minutes ago'

git log --pretty=oneline --until='5 minutes ago'
# 显示当前分支上所有的提交历史
git log --pretty=oneline --all

git log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short
# --pretty="..."  定义输出的格式。
# %h :提交哈希值的缩写
# %d :提交所在的分支或标签等引用的名称
# %ad :提交的作者修订日期
# %s :提交的说明
# %an:作者姓名
# --graph:通知 git 以 ASCII 图形布局显示提交树（前面的 *）
# --date=short:设置为短日期格式（YYYY-MM-DD）

# 回退
git reset --hard 版本号
git reset --hard head~1 # 回退到上一次提交
git checkout xxx.txt # 恢复未暂存的文件

# branch 分支实质上仅仅是一个指针，每次代码提交后，这个分支指针就会向后移动，保证一直指向最后一次提交的的版本
# 创建分支
git branch [branch]
# 查看分支
git branch
# 切换分支
git checkout [branch|commit]
# 创建并切换分支
git checkout -b [branch]
# 创建并切换分支，分支已存在会直接切换
git checkout -b [branch]
# 删除分支
git branch -d [branch]
# 强制删除分支
git branch -D [branch]
# 合并分支
git merge [branch]
# 删除指定分支
git branch | grep ‘dev*’ | xargs git branch -d

# 暂存
# 暂时隐藏工作区内代码
git stash
# 恢复代码
git stash apply
# 恢复代码并删除 stash
git stash pop

# tag
git tag <tagname>
git tag -d <tagname>
git tag -a <tagname> -m "message"
```

```shell
git commit --amend                       对最新的一条commit进行修正
git reset --hard HEAD^                   丢弃最新提交（未提交的内容会被擦掉）
git reset --soft HEAD^                   丢弃最新提交（未提交的内容不会被擦掉）
git revert HEAD^                         回到某个commit
git revert <commit>
git rebase 目标基础点                      重新设置基础点
```

### 配置别名

对常用的一些命令进行别名配置，提升自己的工作效率

```shell
git config --global alias.hist "log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short"
git config --global alias.st status                 git status ==> git st
git config --global alias.ci commit                 git commit ==> git ci
git config --global alias.co checkout               git checkout ==> git co
git config --global alias.br branch                 git barnch ==> git br
git config --global alias.sh stash                  git stash ==> git sh
git config --global alias.pop "stash pop"           git stash pop ==> git pop
```

### 远程仓库

```shell
git clone [远程仓库地址]
git clone [远程仓库地址] [本地项目名]
git clone http://userName:password@远程仓库地址

# 添加仓库别名
git remote add 仓库别名 仓库地址
git remote add xiamibuchi git@github.com:xiamibuchi/yang-packages.git
# 删除别名
git remote remove xiamibuchi
# 查看所有别名
git remote

git push [仓库地址] master
# 将本地当前分支 推送到 远程指定分支上
git push origin <本地分支名>:<远程分支名>
# 将本地当前分支 推送到 与本地当前分支同名的远程分支上
git push origin <本地分支名>
# 将本地分支与远程同名分支相关联并推送
git push -u origin <本地分支名>
git push origin master
# 删除远程分支
git push -d origin <远程分支名>

# 拉取远程代码
git pull
```

> 如果使用了`git clone`命令从远程仓库获取下来的，那么这个本地仓库会自动添加一个 origin 的远程地址

## github pages 介绍

[GitHub Pages](https://pages.github.com/)用于介绍托管在 GitHub 的项目

## 免密码登陆

git 支持多种数据传输协议：

- HTTPS 协议：`https://github.com/xiamibuchi/yang-packages.git`
- SSH 协议：`git@github.com:xiamibuchi/yang-packages.git`

每次 push 或者 pull 代码，如果使用 https 协议，那么都需要输入用户名和密码进行身份的确认，非常麻烦。

### SSH 免密码登录配置

注意：这些命令需要在 bash 中敲

- 1 创建 SSH Key：`ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`
- 2 在文件路径  `C:\用户\当前用户名\` / `/Users/you/.ssh/` 找到  `.ssh`  文件夹
- 3 文件夹中有两个文件：
  - 私钥：`id_rsa`
  - 公钥：`id_rsa.pub`
- 4 在  `github -> settings -> SSH and GPG keys`页面中，新创建 SSH key
- 5 粘贴 公钥  `id_rsa.pub`  内容到对应文本框中
- 5 在 github 中新建仓库或者使用现在仓库，拿到`git@github.com:用户名/仓库名.git`
- 6 此后，再次 SSH 方式与 github“通信”，不用输入密码确认身份了

## Commit Message

基本格式：

```
<type>[optional scope]: <description>
​<BLANK LINE>
[optional body]
​<BLANK LINE>
[optional footer(s)]
```

- 标题行: 必填, 描述主要修改类型和内容
- body: 描述为什么修改, 做了什么样的修改, 以及开发的思路等等
- footer: BREAKING CHANGE 或 Closed Issues

### TYPE

- feat: 新特性/新功能
- fix: bugfix
- refactor: 重构代码
- perf：提升性能
- docs: 文档修改
- style: 代码格式修改（空格，换行，双引号...）, 注意不是 css 修改
- test: 测试
- chore: 其他修改, 比如构建流程, 依赖管理
- revert: 撤回

### scope

commit 影响的范围, 比如: route, component, utils, build...

### commitlint

[commitlint](https://commitlint.js.org/)

用于规范 commit message

```shell
# install
npm install --save-dev @commitlint/config-conventional @commitlint/cli
# Configure commitlint to use conventional config
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# install husky
npm install husky --save-dev
# Activate hooks
npx husky install
# Add git hook
npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
```

## git autocomplete commands

### Zsh

```shell
echo 'autoload -Uz compinit && compinit' >> ~/.zshrc
source ~/.zshrc
```

### Bash

Download the necessary script to your Mac by using the following curl command:

`curl https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash -o ~/.git-completion.bash`

Add the following line to the ~/.bash_profile file:

```shell
if [ -f ~/.git-completion.bash ]; then
  . ~/.git-completion.bash
fi
```

Make the Bash script executable by running the following command:

`chmod +x ~/.git-completion.bash`

Restart your Terminal application or run the following command:

`source ~/.bash_profile`

## use git in Android

### Limitations

- If Termux is closed in the background by Android, the cron service will stop updating your repository and you must open Termux again. Refer to instructions for your device model to disable the killing of certain background applications.
- This may negatively affect your devices battery life. I'm not entirely sure yet.

### Setup

- Install [Termux – Apps on Google Play](https://play.google.com/store/apps/details?id=com.termux&hl=en_GB&gl=US)
- Open Termux, run `termux-change-repo`. Press the ↓ button and press spacebar to tick all repositories, then press enter to move to the next screen
- Press ↓, then spacebar to tick the "Mirrors hosted by Albatross", press enter
- `pkg update && pkg upgrade`
- `pkg install git`
- Run `cd storage/shared` (If you get permissions issues, refer to [this page](https://wiki.termux.com/wiki/Termux-setup-storage))
- Run `git config --global user.email "<your_email>"`
- Run `git config --global user.name "<The name you want on your commits>"`
- Run `git clone <your repository>`
- With this setup so far, you will need to manually go into the folder in Termux and type `git pull`. If you'd like to create shortcuts to do this on your homescreen, see [this guide](https://renerocks.ai/blog/obsidian-encrypted-github-android/#shortcuts-for-committing-pushing-and-pulling)

[Termux-setup-storage](https://wiki.termux.com/wiki/Termux-setup-storage)

## 开发模式

- git flow: master/hotfix/release/develop/feature 分支用于管理不同阶段的代码
- 主干开发: 开发人员之间通过约定向被指定为“主干”的分支提交代码，以此抵抗因为长期存在的多分支导致的开发压力。
