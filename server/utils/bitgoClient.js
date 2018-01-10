const Bitgo = require('bitgo');

class BitGoClient {
  constructor() {
    this.client = null;
  }

  initClient(opts) {
    this.client = new Bitgo.Bitgo({
      accessToken : opts.accessToken
    });
  }
}

module.exports = new BitGoClient();