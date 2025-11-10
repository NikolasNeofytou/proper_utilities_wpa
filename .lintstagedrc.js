module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,css,md}': ['prettier --write'],
  // Ignore node_modules to prevent picking up deprecated configs
  ignore: ['node_modules/**'],
};

