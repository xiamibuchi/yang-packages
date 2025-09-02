import eslint from '@antfu/eslint-config';

export default eslint(
  {
    ignores: [
      '.prototools',
      'Dockerfile',
      'LICENSE',
      '**/LICENSE/**',
      '**/*.min.js',
      '**/*.min.css',
      '*.html',
      '**/*.html/**',
      'node_modules',
      '**/node_modules/**',
      'dist',
      '**/dist/**',
      'out',
      '**/out/**',
      'pnpm-lock.yaml',
      '**/pnpm-lock.yaml/**',
    ],
    unocss: true,
    vue: true,
    typescript: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
    },

    rules: {
      /**
       * Enforce curly braces all the time.
       *
       * @see https://eslint.org/docs/latest/rules/curly
       */
      curly: ['error', 'all'],
      'antfu/curly': 'off',

      /**
       * Enforce semicolons all the time.
       *
       * @see https://eslint.style/rules/semi
       */
      'style/semi': ['error', 'always'],
      /**
       * Enforce semicolons as same as the `style/semi` rule.
       *
       * @see https://eslint.style/rules/member-delimiter-style
       */
      'style/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: true,
          },
          multilineDetection: 'brackets',
        },
      ],

      /**
       * Enforce one true brace style.
       *
       * @see https://eslint.style/rules/brace-style
       */
      'style/brace-style': ['error', '1tbs'],
      'vue/brace-style': ['error', '1tbs'],

      /**
       * Enforce parens around arguments in all cases.
       *
       * @see https://eslint.style/rules/arrow-parens
       */
      'style/arrow-parens': ['error', 'always'],

      /**
       * Enforce quote properties only as-needed.
       *
       * @see https://eslint.style/rules/quote-props
       */
      'style/quote-props': ['error', 'as-needed'],
      'vue/quote-props': ['error', 'as-needed'],
      'jsonc/quote-props': ['error', 'always'],

      /**
       * Allow all kinds of function declarations.
       *
       * @see https://github.com/antfu/eslint-plugin-antfu/blob/main/src/rules/top-level-function.md
       */
      'antfu/top-level-function': 'off',

      /**
       * We don't need command codemod.
       *
       * @see https://github.com/antfu/eslint-plugin-command
       */
      'command/command': 'off',

      /**
       * Allow both template string and string concatenation.
       *
       * @see https://eslint.org/docs/latest/rules/prefer-template
       */
      'prefer-template': 'off',
      'vue/prefer-template': 'off',

      /**
       * Disable sort imports and exports statements.
       *
       * Ideally, we should enable these rules,
       * but some developers might introduce side-effects
       * once modules get evaluated (imported or exported), we can't force everyone to write clean code.
       * So we dicide to disable these rules.
       *
       * @see https://perfectionist.dev/rules/sort-imports
       */
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-exports': 'off',

      /**
       * Allow all kinds of errors.
       *
       * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v60.0.0/docs/rules/prefer-type-error.md
       */
      'unicorn/prefer-type-error': 'off',

      /**
       * Allow all kinds of exponentiation operators.
       *
       * @see https://eslint.org/docs/latest/rules/prefer-exponentiation-operator
       */
      'prefer-exponentiation-operator': 'off',

      /**
       * Allow all kinds of class name styles.
       *
       * @see https://eslint.vuejs.org/rules/prefer-separate-static-class.html
       */
      'vue/prefer-separate-static-class': 'off',

      /**
       * Enforce the order of Vue define macros.
       *
       * @see https://eslint.vuejs.org/rules/define-macros-order.html
       */
      'vue/define-macros-order': [
        'error',
        {
          order: [
            'defineOptions',
            'defineProps',
            'defineModel',
            'defineEmits',
            'defineSlots',
          ],
        },
      ],

      /**
       * Enforce self-closing tags if no children.
       *
       * (It's unsafe in raw html for void elements (e.g. `<img>`/`<br>`),
       * but we are always using Vue or React, so it's always fine.)
       *
       * TODO: `<img></img>` will be auto-fixed as `<img /></img>`,
       * THIS IS NOT CURRECT! We should fix this within the eslint plugin.
       *
       * @see https://eslint.vuejs.org/rules/html-self-closing.html
       */
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],

      /**
       * Enfore a maximum of 3 attributes if single line,
       * and 1 attribute per line if multiline.
       *
       * @see https://eslint.vuejs.org/rules/max-attributes-per-line.html
       */
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
          multiline: 1,
        },
      ],

      /**
       * Enfore camelCase attribute names.
       *
       * @see https://eslint.vuejs.org/rules/attribute-hyphenation.html
       */
      'vue/attribute-hyphenation': ['error', 'never'],

      /**
       * Enforce camelCase event names in Vue 3.
       *
       * @see https://eslint.vuejs.org/rules/v-on-event-hyphenation.html
       */
      'vue/v-on-event-hyphenation': [
        'error',
        'never',
        {
          autofix: true,
        },
      ],
      /**
       * Enforce camelCase event names in Vue 3.
       *
       * @https://eslint.vuejs.org/rules/custom-event-name-casing.html
       */
      'vue/custom-event-name-casing': ['error', 'camelCase'],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      /**
       * Disable require import statements to be the first in the Vue files.
       * @see https://github.com/vuejs/eslint-plugin-vue/issues/1577
       */
      'import/first': 'off',
    },
  },
);
