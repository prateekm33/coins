import walletTypes from '../types/walletTypes';
import bitgo from '../../utils/BitGoClient';

export const sendTransaction = (form, wallet, denomination = 'btc') => {
  const { address, amount, message, walletPassphrase, otp } = form;
  const txn = {
    address : address.value,
    amount : getAmount(+amount.value, denomination),
    message : message.value,
    walletPassphrase : walletPassphrase.value
  };
  return (dispatch, getState) => {
    bitgo.client.unlock({ otp : otp.value })
      .then(session => {
        return bitgo.wallets().get({
          id : wallet.id()
        })
      })
      .then(res => {
        console.warn("get wallet : ", res);
        return res.sendCoins(txn);
      })
      .then(res => {
        console.warn("sent txn : ", res);
      })
      .catch(err => {
        console._error("error txn : ", err);
      });
  }
}

function getAmount(amnt, denom) {
  switch (denom.toLowerCase()) {
    case 'sat' : 
      return amnt;
    case 'btc' :
      return amnt * 1e8;
    default :
      return null;
  }
}