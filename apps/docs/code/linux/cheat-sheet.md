# CheatSheet For Linux Command

## working with commands

```shell
# *********************************************************************************
# There are four type commands:
#   1. Executable program: like all those files in /usr/bin. Programs can be compiled binaries such as programs written in C and C++.
#   2. Command built into shell itself. Such as cd.
#   3. shell function.
#   4. alias.
# *********************************************************************************

# display type of command
$ type <command>
# display na executable's location
$ which <executable>
# get help for shell builtin commands
$ help <command>
# display useful infos: command syntax and options
$ <command> --help
# display program's manual page
$ man <command>
# display the name and on-line description of man page
$ whatis <command>
# give a alias to command
$ alias <alias>=<command>
# unalias
$ unalias <alias>
```

## navigation

```shell
# print working directory
$ pwd
# jump to /usr/bin
$ cd /usr/bin
# jump to parent directory
$ cd ..
# jump to home directory
$ cd ~
# jump to previous directory
$ cd -
# jump to specific user home directory
$ cd ~<user_name>
```

## Looking Around

```shell
# list contents of working directory
$ ls
# list contents of /bin directory
$ ls /bin
# list files in working directory in long format
$ ls -l
# list files in /etc and /bin directory
$ ls -l /etc /bin
# view text_file content
$ less <text_file>
# detect what kind of data a file contains
$ file <name_of_file>
```

## Manipulating Files

```shell
# copy file1 to file2
$ cp <file1> <file2>
# copy multiple files to a different directory
$ cp <file>... <directory>
# copy file1 to file2, if file2 already exist, the user is prompted before overwritten
$ cp -i <file1> <file2>
# copy the contents include subdirectory of the directory dir1 to directory dir2
$ cp -R <dir1> <dir2>
# move file1 to file2, like a rename operate, rename file file1 to file2
$ mv <file1> <file2>
# move files (and/or directories) to a different directory
$ move <file...> <directory>
# rename file file1 to file2, if file2 already exist, the user is prompted before overwritten
$ move -i <file1> <file2>
# remove files
$ rm <file...>
# remove directories
$ rm -r <directory...>
# the user is prompted before delete file1 and file2
$ rm -i <file1> <file2>
# create directories
$ mkdir <directory...>
# create hard link for file
$ ln <file> <link>
# create a symbolic link where item is either a file or a directory
$ ln -s <item> <link>
# concatenate files, and print the result to standard output
$ cat <file...>
```

## redirection

```shell
# More information with redirection: https://www.pengfeixc.com/blogs/developer-handbook/pipelines-in-shell
# redirect standard output to test.txt
$ echo Hello World > test.txt
# redirect standard output to test.txt with append mode
$ echo Hello World >> test.txt
# redirect standard error with
$ ls -l /bin/usr 2> ls-error.txt
# redirect standard output and standard error to one file
$ ls -l /bin/usr > ls-output.txt 2>&1
# /dev/null is a special file, called bit bucket, which accepts input and does nothing with it
$ ls -l /bin/usr 2> /dev/null
# join file1 and file2 to new_file
$ cat file1 file2 > new_file
# pipelines: redirect a standard output of a command to standard input
$ command1 | command2
```

## filters

```shell
# sort: sort lines
$ ls /bin /usr/bin | sort
# uniq: report or omit repeated lines
$ ls /bin /usr/bin | uniq
# wc: print Line, word and byte counts
$ wc ls-output.txt
# only print the line count of ls-output.txt
$ wc -l ls-output.txt
# print lines matching a pattern
$ grep <pattern> <file...>
# list all files whose name contains 'zip'
$ ls /bin /usr/bin | grep zip
# print first part of files
$ head -n 5 ls-output.txt
# print last part of files
$ tail -n 5 ls-output.txt
$ ls /usr/bin | tail -n 5
# tee: read from stdin and output to stdout and files
$ ls /usr/bin | tee ls.txt | grep zip
```

## expansion

```shell
# the * character means match any characters in a filename
$ echo *
$ echo D*
# [[:upper:]] means uppercase
$ echo [[:upper:]]*
# [!a]* means all file whose name not start with 'a'
$ echo [!a]*
# ~ means home path for current user
$ echo ~
# ~foo means home path for user 'foo'
$ echo ~foo
# arithmetic expansion
$ echo $((2+2))
# brace expansion
$ echo Front-{A,B,C}-Back
$ echo Number_{1..5}
$ echo {01..15}
$ echo {Z..A}
$ echo a{A{1,2},B{3,4}}b
# variable expansion
$ echo $USER
# see a list of available variables
$ printenv | less
# command substitution: use the output of a command as an expansion
$ echo $(ls)
$ ls -l $(which cp)
```

## quotes

```shell
# double quotes: all the special characters used by the shell lose their special meaning and are treated as ordinary characters. The exceptions are $, \ (backslash), and ` (back-quote).
$ ls -l two words.txt
ls: cannot access two: No such file or directory
ls: cannot access words.txt: No such file or directory
$ ls -l "two words.txt"
-rw-rw-r-- 1 me me 18 2016-02-20 13:03 two words.txt
$ mv "two words.txt" two_words.txt
# parameter expansion, arithmetic expansion, and command substitution still take place within double quotes.
$ echo "$USER $((2+2)) $(cal)"
# not remove extra spaces in our text
$ echo this is a   test
this is a test
$ echo "this is a   test"
this is a   test
# single quotes: suppress all expansions
$ echo 'text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER'
text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER
# escaping characters: \
$ echo "The balance for user $USER is: \$5.00"
```

## tricks

```shell
# *********************************************************************************
# cursor movement:
#   'Ctrl-a' Move cursor to the beginning of the line.
#   'Ctrl-e' Move cursor to the end of the line.
#   'Ctrl-f' Move cursor forward one character; same as the right arrow key.
#   'Ctrl-b' Move cursor backward one character; same as the left arrow key.
#   'Alt-f' Move cursor forward one word.
#   'Alt-b' Move cursor backward one word.
#   'Ctrl-l' Clear the screen and move the cursor to the top-left corner. The clear command does the same thing.
# modify text:
#   'Ctrl-d' Delete the character at the cursor location.
#   'Ctrl-t' Transpose (exchange) the character at the cursor location with the one preceding it.
#   'Alt-t' Transpose the word at the cursor location with the one preceding it.
#   'Alt-l' Convert the characters from the cursor location to the end of the word to lowercase.
#   'Alt-u' Convert the characters from the cursor location to the end of the word to uppercase.
# cutting and pasting (killing and yanking) text:
#   `Ctrl-k` Kill text from the cursor location to the end of line.
#   `Ctrl-u` Kill text from the cursor location to the beginning of the line.
#   `Alt-d` Kill text from the cursor location to the end of the current word.
#   `Alt-Backspace Kill text from the cursor location to the beginning of the current word. If the cursor is at the beginning of a word, kill the previous word.
#   `Ctrl-y` Yank text from the kill-ring and insert it at the cursor location.
# *********************************************************************************
# clear the screen
$ clear
# display the contents of history list
$ history
```

## permissions

```shell
# *********************************************************************************
# id – Display user identity
# chmod – Change a file's mode
# umask – Set the default file permissions
# su – Run a shell as another user
# sudo – Execute a command as another user
# chown – Change a file's owner
# chgrp – Change a file's group ownership
# passwd – Change a user's password
# *********************************************************************************
```

## processes

```shell
# *********************************************************************************
# job control reference: https://www.pengfeixc.com/blogs/developer-handbook/shell-job-control
# ps – Report a snapshot of current processes
# top – Display tasks
# jobs – List active jobs
# bg – Place a job in the background
# fg – Place a job in the foreground
# kill – Send a signal to a process
# killall – Kill processes by name
# shutdown – Shutdown or reboot the system
# *********************************************************************************
```

## search files

```shell
# The locate program performs a rapid database search of pathnames
$ locate <filename>
# Update the database for `locate` command.Normally system will auto run updatedb once a day
$ sudo updatedb
# find all directories in home path
$ find ~ -type d
# find all files in home path
$ find ~ -type f
# find all jpg files which size is greater then 1M in home directory
$ find ~ -type f -name "*.JPG" -size +1M
```
