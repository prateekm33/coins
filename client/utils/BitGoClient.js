import BitGo from 'bitgo';
import { saveUserSession, clearUserSession } from './index';

class Client {
  initClient(opts) {
    this.client = new BitGo.BitGo(opts);
    this.client.session({}).then(res => {
      console.log("session info for bitgo client : ", res, opts);
      saveUserSession({ accessToken : opts.accessToken });
    }).catch(err => {
      console.error("Error initiatlizing session info : \n ", err, opts);
      clearUserSession();
    });

    return this.client.me({}).catch(err => null);
  }

  wallets() {
    return this.client.wallets();
  }
}

export default new Client();