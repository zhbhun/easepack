var path = require('path');

module.exports = function (basePath, name) {
  var suffix = process.env.NODE_ENV === 'development' ? '.dev' : '.prod';
  return path.resolve(basePath, name + suffix);
}
