const path = require('path');

const context = __dirname;

module.exports = {
  presets: [path.resolve(context, 'preset.js')],
};
