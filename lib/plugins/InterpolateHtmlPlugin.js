// copy from [react-dev-utils](https://github.com/facebookincubator/create-react-app/tree/master/packages/react-dev-utils)

const escapeStringRegexp = require('escape-string-regexp');

class InterpolateHtmlPlugin {
  constructor(replacements) {
    this.replacements = replacements;
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-before-html-processing',
        (data, callback) => {
          // Run HTML through a series of user-specified string replacements.
          Object.keys(this.replacements).forEach(key => {
            const value = this.replacements[key];
            data.html = data.html.replace(
              new RegExp('%' + escapeStringRegexp(key) + '%', 'g'),
              value
            );
          });
          callback(null, data);
        }
      );
    });
  }
}

module.exports = InterpolateHtmlPlugin;