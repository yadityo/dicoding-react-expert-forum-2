module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  globals: {
    cy: 'readonly',
    Cypress: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    vi: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
  },
  extends: ['airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/extensions': 'off',
    'max-len': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: ['state', 'thread', 'entity'],
    }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        'vite.config.js',
        'cypress.config.js',
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.cy.js',
        'src/setupTests.js',
        'src/utils/test-utils.jsx',
      ],
    }],
  },
};
