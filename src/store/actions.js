import * as constants from './constants';

export function loadBooks(payload) {
    return { type: constants.LOAD_BOOKS, payload };
}

export function unloadBooks(payload) {
    return { type: constants.UNLOAD_BOOKS, payload };
}

export function loginUser(payload) {
    return { type: constants.USER_LOGIN, payload };
}

export function logoutUser(payload) {
    return { type: constants.USER_LOGOUT, payload };
}