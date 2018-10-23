const path = require('path');

const context = __dirname;

module.exports = (command, options, config) => ({
  entry: path.resolve(context, 'src/index.js'),
  output: {
    path: path.resolve(context, 'build'),
  },
});
