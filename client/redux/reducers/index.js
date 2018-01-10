import { combineReducers } from 'redux';
import userReducer from './userReducer';
import walletReducer from './walletReducer';

const defaultReducers = {
  mainLoadingBar : (state = false, action) => {
    switch (action.type) {
      default : return state;
    }
  }
}

export default combineReducers({
  ...defaultReducers,
  ...userReducer,
  ...walletReducer
});