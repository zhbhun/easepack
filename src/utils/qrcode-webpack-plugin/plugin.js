const qrcode = require('qrcode');

class QRCodePlugin {
  constructor(url) {
    this.url = url;
  }

  print() {
    qrcode.toString(this.url, { type: 'terminal' }, function (error, data) {
      console.log();
      if(error) {
        console.warn(error)
      } else {
        console.log(data)
      }
      console.log();
    });
  }

  apply(compiler) {
    compiler.hooks.done.tap({ name: 'QRCodePlugin' }, (stats) => {
      if (!stats.hasErrors() && !stats.hasWarnings()) {
        this.print();
      }
    });
  }
}

module.exports = QRCodePlugin;
