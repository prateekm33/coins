import userTypes from '../types/userTypes';

export default {
  user(state = null, action) {
    switch (action.type) {
      case userTypes.USER_LOGGED_IN : return action.user;
      default : return state;
    }
  }
}