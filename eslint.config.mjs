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
    extends: ['next', 'next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'],
    plugins: ['@stylistic'],
    ignorePatterns: ['node_modules', 'coverage', 'build', 'dist', 'public', '.vscode', '.idea'],
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'max-len': [
        'error',
        {
          code: 120,
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
          printWidth: 120,
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
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'any', prev: 'expression', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'return' }
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
