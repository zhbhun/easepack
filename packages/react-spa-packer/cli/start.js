// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

var fs = require('fs');
var path = require('path');
var argv = require('yargs').argv;

var ReactSPAPacker = require('../src');

var context = fs.realpathSync(process.cwd());
var config = require(path.resolve(context, argv.config));
ReactSPAPacker.start(config);
