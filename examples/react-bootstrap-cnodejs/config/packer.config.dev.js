var path = require('path');

var ReactSPAPacker = require('react-spa-packer');

var context = path.resolve(__dirname, '../');

module.exports = {
  paths: ReactSPAPacker.path({
    context,
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
  }),
  dll: {
    name: 'dll',
    // use package dependencies
  },
  webpack: {
    resolve: {
      alias: {
        'react-editor': path.resolve(context, 'src/libraries/react-editor'),
      },
    },
  }
};
