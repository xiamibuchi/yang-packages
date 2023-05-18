# 项目

## 规范 commit message

详见 [git-commitlint](../git#commitlint)

## Browserslist

[Browserslist](https://browsersl.ist/)

```
'> 0.25%', 'ie >= 10', 'android >= 4.4.4', 'iOS >= 9.3'
```

## int-staged

[int-staged](https://github.com/okonet/lint-staged)

```
<!-- package.json -->
  ...
  "lint-staged": {
    "*.{ts,js,vue,tsx}": [
      "eslint --fix -c .eslintrc.cjs"
    ]
  },
  ...
```

```
<!-- pre-commit -->
npx lint-staged
```
