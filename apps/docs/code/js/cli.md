# 简介

## inquirer

[Github](https://github.com/SBoudrias/Inquirer.js)

```js
inquirer
  .prompt([
    {
      type: 'input',
      name: 'question',
      message: '请问需要什么服务？',
    },
  ])
  .then((res) => {
    console.log('成功！', res);
  })
  .catch((err) => {
    console.error('报错！', err);
  });
```
