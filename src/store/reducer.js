import * as constants from './constants';

const initialState = {
  books: [],
  userLoggedIn: false
};

function rootReducer(state = initialState, action) {
  if (action.type === constants.LOAD_BOOKS) {
    state.books = action.payload;
  } else if (action.type === constants.UNLOAD_BOOKS) {
      state.books = [];
  } else if (action.type === constants.USER_LOGIN) {
      state.userLoggedIn = true;
  } else if (action.type === constants.USER_LOGOUT) {
      state.userLoggedIn = false;
  }
  return state;
}

export default rootReducer;