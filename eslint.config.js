//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import importPlugin from 'eslint-plugin-import-x'

export default [
  {
    ignores: ['eslint.config.js', 'prettier.config.js', '**/.output/**'],
  },
  ...tanstackConfig,
  {
    // Since we're overriding a rule from the above this needs to be imported and defined by us
    plugins: { import: importPlugin },
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
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
