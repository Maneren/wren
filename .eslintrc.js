module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['import'],
  extends: [
    'eslint:recommended',
    'semistandard',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime'
  ],
  rules: {
    semi: 'error',
    quotes: [1, 'single'],
    'jsx-quotes': [1, 'prefer-single'],
    'react/prop-types': 'off'
  }
};
