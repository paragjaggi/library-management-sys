import * as constants from './constants';

const initialState = {
  books: [],
  userLoggedIn: ""
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_BOOKS:
      state = {
        ...state,
        books: action.payload
      };
      break;
    case constants.UNLOAD_BOOKS:
      state = {
        ...state,
        books: []
      }
      break;
    case constants.USER_LOGIN:
      state = {
        ...state,
        userLoggedIn: action.payload
      }
      break;
    case action.type === constants.USER_LOGOUT:
      state = {
        ...state,
        userLoggedIn: []
      }
      break;
    default:
      break;
  }
  return state;
}

export default rootReducer;