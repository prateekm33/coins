import { combineReducers } from 'redux';
import userReducer from './userReducer';
import walletReducer from './walletReducer';
import userTypes from '../types/userTypes';
import walletTypes from '../types/walletTypes';
import appTypes from '../types/appTypes';

const defaultReducers = {
  mainLoadingBar : (state = false, action) => {
    switch (action.type) {
      default : return state;
    }
  },

  appLoading(state = false, action) {
    switch (action.type) {
      case appTypes.LOADING : return action.appLoading;
      default : return state;
    }
  },

  contentBusy(state = false, action) {
    switch (action.type) {
      case userTypes.LOGGING_USER_OUT : return action.loading;
      case userTypes.USER_LOGGED_OUT : return false;
      default : return state;
    }
  }
}

export default combineReducers({
  ...defaultReducers,
  ...userReducer,
  ...walletReducer
});