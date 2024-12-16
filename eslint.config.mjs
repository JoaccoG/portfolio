import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'next',
      'next/core-web-vitals',
      'next/typescript',
      'plugin:prettier/recommended'
    ],
    plugins: ['@stylistic'],
    ignorePatterns: [
      'node_modules',
      '.next',
      'out',
      'public',
      'coverage',
      'build'
    ],
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'max-len': [
        'error',
        {
          code: 80,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true
        }
      ],
      'object-curly-spacing': ['error', 'always'],
      'arrow-parens': ['error', 'always'],
      'react/jsx-wrap-multilines': [
        'error',
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line'
        }
      ],
      indent: ['error', 2],
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          singleQuote: true,
          trailingComma: 'none',
          arrowParens: 'always',
          bracketSpacing: true,
          endOfLine: 'lf'
        }
      ],
      'import/no-anonymous-default-export': 'off',
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'block-like', next: '*' }, // Adds a blank line after blocks (if, for, etc).
        { blankLine: 'any', prev: 'expression', next: 'return' }, // Allows the return in an expression to have no blank line.
        { blankLine: 'always', prev: '*', next: 'return' } // Adds a blank line before return statements.
      ]
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        rules: {}
      }
    ]
  })
];

export default eslintConfig;
