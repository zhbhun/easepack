var path = require('path');

var context = path.resolve(__dirname, '../');

module.exports = {
  context: context,
  source: {
    src: 'src',
    main: 'src/index.js',
    public: 'public',
    html: 'public/index.html',
  },
  output: {
    path: {
      dll: '.dll',
      build: 'build',
    },
  },
};
