const presets = [
  [
    '@babel/preset-env',
    {
      targets: {},
      useBuiltIns: 'usage',
      corejs: '3',
    },
  ],
  [
    '@babel/preset-typescript',
    {
      allExtensions: true, //支持所有文件扩展名
    },
  ],
];
const plugins = [];

module.exports = {
  presets,
  plugins,
};
