const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      corejs: {
        // core-js 需指定具体版本
        version: '3.30.2',
        // 提案阶段的 ECMAScript 特性是否会被转译
        proposals: true,
      },
      modules: false,
    },
  ],
  [
    '@babel/preset-typescript',
    {
      allExtensions: true, //支持所有文件扩展名
    },
  ],
];
const plugins = [
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: {
        version: 3,
        proposals: true,
      },
      helpers: true,
      regenerator: true,
    },
  ],
];

module.exports = {
  presets,
  plugins,
};
