import react from 'eslint-plugin-react';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['node_modules', 'public', 'coverage', 'build', 'dist', 'pnpm-lock.yaml', '.vscode', '.idea', '*.log']
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { react, prettier, stylistic, '@typescript-eslint': tsPlugin },
    settings: { react: { version: 'detect' } },
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.app.json', tsconfigRootDir: '.' },
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: globals.browser
    },
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
          tabWidth: 2,
          useTabs: false,
          singleQuote: true,
          bracketSpacing: true,
          trailingComma: 'none',
          arrowParens: 'always',
          endOfLine: 'lf'
        }
      ],
      'import/no-anonymous-default-export': 'off',
      'stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'any', prev: 'expression', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'return' }
      ],
      // TypeScript specific rules
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports'
        }
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error'
    }
  },
  {
    files: ['*.config.{js,mjs,ts}', '*.setup.{js,ts}', 'eslint.config.mjs'],
    plugins: { prettier, stylistic },
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: { ...globals.node }
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'prettier/prettier': [
        'error',
        {
          printWidth: 120,
          tabWidth: 2,
          useTabs: false,
          singleQuote: true,
          bracketSpacing: true,
          trailingComma: 'none',
          arrowParens: 'always',
          endOfLine: 'lf'
        }
      ]
    }
  }
];
