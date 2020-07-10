'use strict';

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',  
    'prettier/@typescript-eslint',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: '2018',
    sourceType: 'module',
    project: 'tsconfig.eslint.json',
  },
  plugins: ['@typescript-eslint', 'cdk', 'import', 'jest', 'prettier'],
  ignorePatterns: ['*.js', '*.d.ts', 'node_modules'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-use-before-define': 'off',

    // Require use of the `import { foo } from 'bar';` form instead of `import foo = require('bar');`
    '@typescript-eslint/no-require-imports': ['error'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
        argsIgnorePattern: '^_',
      },
    ],

    'cdk/construct-ctor': 'error',
    'cdk/filename-match-regex': 'error',
    'cdk/public-static-property-all-caps': 'error',
    'cdk/no-static-import': 'error',
    'cdk/props-struct-name': 'error',

    // Require all imported dependencies are actually declared in package.json
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          // Only allow importing devDependencies from:
          '**/__tests__/**/**', // --> Unit tests
          '**/lambdas/**/**', // --> Lambdas
        ],
        optionalDependencies: false, // Disallow importing optional dependencies (those shouldn't be in use in the project)
        peerDependencies: false, // Disallow importing peer dependencies (that aren't also direct dependencies)
      },
    ],
    'jest/expect-expect': [
      'warn',
      {
        assertFunctionNames: ['expect', 'expectCDK'],
      },
    ],
    'jest/consistent-test-it': [
      'error',
      { 
        fn: 'test' 
      }
    ],
    'jest/no-identical-title': 'error',
    
    //Style
    'prettier/prettier': ['error', { 
      'tabWidth': 2,
      'singleQuote': true, 
      'semi': true,
      'trailingComma': 'all', // ensures clean diffs, see https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8
    }]
  },
};