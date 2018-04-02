// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

var fs = require('fs');
var path = require('path');
var yargs = require('yargs');

var argv = yargs.argv;
var context = fs.realpathSync(process.cwd());
var config = require(path.resolve(context, argv.config));

var start = require('../lib/start');
start(config);
