module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  'extends': 'airbnb-base',
  'parserOptions': {
    'sourceType': 'module',
  },
  'rules': {
    // This is a cli tool. Therefore, we don't really care about console logs.
    'no-console': 'off',
  }
};