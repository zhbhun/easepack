var defaultConfig = require('./utils/defaultConfig');
var buildDll = require('./utils/buildDll');
var runDevServer = require('./utils/runDevServer');

module.exports = function (params) {
  var config = defaultConfig(params);
  buildDll(config, function () {
    runDevServer(config);
  });
};
