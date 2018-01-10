import userTypes from '../types/userTypes';
import walletTypes from '../types/walletTypes';
import bitgo from '../../utils/BitGoClient';
import mockWallets from '../../mockData/wallets.json';
import { saveUserSession } from '../../utils';


export const loginUser = user => {
  return (dispatch, getState) => {
    return bitgo.client.authenticate(user).then(res => {
      console.log('loginUser action : ', res);
      saveUserSession(res);
      dispatch(logUserIn(res.user));
      return true;
    }).catch(err => {
      console.log("Error loggin in user : ", user);
      console.error("Error : ", err);
      return false;
    });
  }
}

export const logUserIn = user => {
  return (dispatch, getState) => {
    dispatch(userLoggedIn(user));
    dispatch(requestWallets());
  }
}

const userLoggedIn = user => {
  return {
    type : userTypes.USER_LOGGED_IN,
    user
  }
}

// for loading state UI
const loggingIn = () => {
  return {
    type : userTypes.LOGGING_IN
  }
}

const loadWallets = wallets => {
  return {
    type : walletTypes.LOAD_WALLETS,
    wallets
  }
}

const requestWallets = (startIndex = 0, getbalances = true) => {
  return (dispatch, getState) => {
    const wallets = bitgo.wallets();
    wallets.list({ skip : startIndex, getbalances }).then(res => {
      dispatch(loadWallets(res));
    }).catch(err => {
      console.log("Error fetching more wallets : ", err);
    });
  }
}

/*
------------ WALLET CREATION -----------

 const params = {
        passphrase : 'temp passphrase',
        label : 'temp label 2'
      }
      return bitgo.wallets().createWalletWithKeychains(params)
        .then(res => {
          console.log('result : ', res);
          console.log("Wallet : ", res.wallet);
          console.log("keychain : ", res.userKeychain.encryptedXprv);
          res.wallet.createAddress({ chain : 0 })
            .then(address => {
              console.log("Addres : ", address);
            }).catch(err => {
              console.log("Error creating address for wallet : ", err);
            })
        })


*/