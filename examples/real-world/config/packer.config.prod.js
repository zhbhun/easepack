var path = require('path');

var context = path.resolve(__dirname, '../');

module.exports = {
  context,
  source: {
    src: 'src',
    main: 'src/index.js',
    public: 'public',
    html: 'public/index.html',
  },
  output: {
    path: {
      build: 'build',
    },
  },
  chunks: [
    {
      name: 'react',
      dependencies: [
        'react',
        'react-bootstrap',
        'react-dom',
        'react-router',
        'react-router-bootstrap',
      ],
    }, {
      name: 'react-editor',
      dependencies: path.resolve(context, 'src/libraries/react-editor'),
    }
  ],
};

