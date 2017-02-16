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
  chunks: {
    dependencies: ['base', 'react', 'react-editor'],
    base: Infinity,
    react: [
      'react',
      'react-bootstrap',
      'react-dom',
      'react-router',
      'react-router-bootstrap',
    ],
    'react-editor': path.resolve(context, 'src/libraries/react-editor'),
  },
};

