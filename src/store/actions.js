import * as constants from './constants';

export function loadBooks(payLoad) {
    return { type: constants.LOAD_BOOKS, payLoad };
}

export function unloadBooks(payLoad) {
    return { type: constants.UNLOAD_BOOKS, payLoad };
}

export function loginUser(payLoad) {
    return { type: constants.USER_LOGIN, payLoad };
}

export function logoutUser(payLoad) {
    return { type: constants.USER_LOGOUT, payLoad };
}