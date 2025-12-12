//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  // {
  //   ignores: ['eslint.config.js', 'prettier.config.js'],
  // },
  ...tanstackConfig,
  {
    rules: {
      '@typescript-eslint/array-type': 'off',
      'import/consistent-type-specifier-style': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'internal',
              position: 'before',
            },
          ],

          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'sort-imports': [
        'error',
        { ignoreCase: true, ignoreDeclarationSort: true },
      ],
    },
  },
]
