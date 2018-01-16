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
    return bitgo.client.unlock({ otp : otp.value })
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
        return {  error : false };
      })
      .catch(err => {
        console._error("error txn : ", err);
        window.err = err;
        let message, type;
        const errMessage = err.message.toLowerCase();
        if (errMessage.includes('invalid bitcoin address')) {
          message = 'The receiving address is an invalid Bitcoin address';
          type = 'address';
        } else if (errMessage.includes('insufficient funds')) {
          message = 'You do not have sufficient funds for this transaction';
          type = 'amount';
        } else if (errMessage.includes('unable to decrypt user keychain')) {
          message = 'Incorrect wallet password';
          type = 'password';
        } else {
          message = 'Oops! Something went wrong. The issue may be with connectivity.';
          type = 'network';
        }
        return { error : true, message, type };
        // return { error : true, }
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