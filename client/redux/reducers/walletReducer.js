import walletTypes from '../types/walletTypes';
import userTypes from '../types/userTypes';
import Wallets from '../../utils/Wallets';

export default {
  wallets(state, action) {
    switch (action.type) {
      case walletTypes.LOAD_WALLETS : 
        return formatWallets(state, action.wallets);
      case userTypes.USER_LOGGED_OUT : return new Wallets();
      default : return state || new Wallets();
    }
  },

  activeWallet(state = null, action) {
    switch (action.type) {
      case walletTypes.SET_ACTIVE_WALLET : 
        return { ...action.wallet };
      case userTypes.USER_LOGGED_OUT : return null;
      default : return state;
    }
  }
}


function formatWallets(wallets = new Wallets(), newWallets) {
  return wallets.merge(new Wallets(newWallets));
}