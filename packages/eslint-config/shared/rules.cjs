module.exports = {
  indent: ['error', 2],
  'linebreak-style': ['error', 'unix'],
  quotes: ['error', 'single'],
  semi: ['error', 'always'],
  'no-debugger': 'error',
  'no-unused-vars': [
    'error',
    // we are only using this rule to check for unused arguments since TS
    // catches unused variables but not args.
    { varsIgnorePattern: '.*', args: 'none' },
  ],
};
