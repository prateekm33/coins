import userTypes from '../types/userTypes';
import walletTypes from '../types/walletTypes';
import bitgo from '../../utils/BitGoClient';
import mockWallets from '../../mockData/wallets.json';
import { saveUserSession } from '../../utils';

export const loginUser = user => {
  return (dispatch, getState) => {
    dispatch(loggingIn());
    return bitgo.client.authenticate(user).then(res => {
      saveUserSession(res);
      dispatch(logUserIn(res.user));
      return { error : false };
    }).catch(err => {
      let message;
      switch (err.message) {
        case 'invalid_grant' :
          message = err.result.message;
          break;
        case 'invalid_client' :
          message = "Username or password is incorrect";
          break;
        case 'needs_otp' :
          message = "The one time password provided is incorrect";
          break;
        default :
          message = "Error logging in. Check credentials and try again. If the problem persists, try again in a few minutes. There issue may be with the server";
          break;
      }
      dispatch(loggingIn(false));
      console._error("Error logging in user", err);
      bitgo.sanitizeClient();
      return { error : true, msg : message }
    });
  }
}

export const logUserIn = user => {
  return (dispatch, getState) => {
    dispatch(userLoggedIn(user));
    dispatch(requestWallets());
  }
}

export const userLoggedIn = user => {
  return {
    type : userTypes.USER_LOGGED_IN,
    user
  }
}

// for loading state UI
export const loggingIn = (loading = true) => {
  return {
    type : userTypes.LOGGING_IN,
    loading
  }
}

export const logoutUser = () => {
  return (dispatch, getState) => {
    dispatch({ type : userTypes.LOGGING_USER_OUT, loading : true });
    bitgo.client.logout({}, err => {
      // bitgo.client = null;
      if (err) console._error("Error logging out user ", err);
      dispatch({ type : userTypes.USER_LOGGED_OUT });
    });
  }
}

export const loadWallets = wallets => {
  return {
    type : walletTypes.LOAD_WALLETS,
    wallets
  }
}

export const requestWallets = (startIndex = 0, getbalances = true) => {
  return (dispatch, getState) => {
    const wallets = bitgo.wallets();
    wallets.list({ skip : startIndex, getbalances }).then(res => {
      dispatch(loadWallets(res));
    }).catch(err => {
      console._error("Error fetching more wallets : ", err);
    });
  }
}

export const setActiveWallet = wallet => {
  return {
    type : walletTypes.SET_ACTIVE_WALLET,
    wallet
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