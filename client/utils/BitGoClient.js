import BitGo from 'bitgo';
import { saveUserSession, clearUserSession } from './index';
import store from '../redux/store';
import { logUserIn } from '../redux/actions/userActions';
import appTypes from '../redux/types/appTypes';

class Client {
  initClient(opts) {
    this.opts = opts;
    this.client = new BitGo.BitGo(opts);
    // if there is no access token saved, then we don't need to check for 
    // the current user session
    if (!opts.accessToken) {
      clearUserSession();
      store.dispatch({
        type : appTypes.LOADING,
        appLoading : false
      });
      return;
    }

    store.dispatch({
      type : appTypes.LOADING,
      appLoading : true
    });
    this.client.session({}).then(res => {
      saveUserSession({ accessToken : opts.accessToken });
      return this.client.me({})
    })
    .then(user => {
      store.dispatch(logUserIn(user));
      store.dispatch({
        type : appTypes.LOADING,
        appLoading : false
      });
    })
    .catch(err => {
      console._error("Error initializing session info : \n ", err, opts);
      store.dispatch({
        type : appTypes.LOADING,
        appLoading : false
      });
      this.sanitizeClient();
    });
  }

  wallets() {
    return this.client.wallets();
  }

  sanitizeClient() {
    clearUserSession();
    this.client.logout({})
      .catch(err => {
        console._error("Error resetting client. Initiating hard reset. ", err);
        delete this.opts.accessToken;
        this.client = new BitGo.BitGo(this.opts);
      });
  }
}

export default new Client();