module.exports = {
  'root': true,
  'env': {
    node: true
  },
  'extends': [
    'nzcl',
    'plugin:vue/recommended'
  ],
  'rules': {
    'no-invalid-this': 0,
    'indent': ['error', 2],
    'no-process-env': 0
  }
};
