import userTypes from '../types/userTypes';

export default {
  user(state = null, action) {
    switch (action.type) {
      case userTypes.USER_LOGGED_IN : return action.user;
      case userTypes.USER_LOGGED_OUT : return null;
      default : return state;
    }
  },

  verifyingUser(state = false, action) {
    switch (action.type) {
      case userTypes.LOGGING_IN : return action.loading;
      case userTypes.USER_LOGGED_IN : return false;
      default : return state;
    }
  }
}