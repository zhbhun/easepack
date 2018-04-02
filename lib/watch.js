// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

var fs = require('fs');
var path = require('path');
var argv = require('yargs').argv;

var configProcess = require('../utils/configProcess');
var buildDll = require('../utils/buildDll');
var buildWatch = require('../utils/buildWatch');

var context = fs.realpathSync(process.cwd());
var config = require(path.resolve(context, argv.config));
var dllConfig = configProcess(config, 'dll');
var developmentConfig = configProcess(config, 'development');

buildDll(dllConfig, function () {
  buildWatch(developmentConfig, dllConfig);
});

