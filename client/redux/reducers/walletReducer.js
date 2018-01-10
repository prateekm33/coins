import walletTypes from '../types/walletTypes';
import Wallets from '../../utils/Wallets';

export default {
  wallets(state = null, action) {
    switch (action.type) {
      case walletTypes.LOAD_WALLETS : 
        return formatWallets(state, action.wallets);
      default : return state || new Wallets();
    }
  },

  activeWallet(state = null, action) {
    switch (action.type) {
      case walletTypes.SET_ACTIVE_WALLET : 
        return { ...action.wallet };
      default : return state;
    }
  }
}


function formatWallets(wallets = new Wallets(), newWallets) {
  return wallets.merge(new Wallets(newWallets));
}