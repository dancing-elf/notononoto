import {copy} from "../util/util";

import {
    UPDATE_LOGIN,
    UPDATE_PASSWORD,
    ERROR_LOGIN
} from "../actions/ActionTypes";

const initialState = {
    loginValue: "",
    passwordValue: "",
    isLoginOk: true
};

/**
 * Reducer of login form component
 * @param state state of login form
 * @param action action to do
 * @returns {*} new state after doing action
 */
export function login(state = initialState, action) {
    switch (action.type) {
        case UPDATE_LOGIN:
            return action.value.length >= 50 ?
                state : copy(state, {loginValue: action.value});
        case UPDATE_PASSWORD:
            return action.value.length >= 50 ?
                state : copy(state, {passwordValue: action.value});
        case ERROR_LOGIN:
            return copy(state, {isLoginOk: false});
        default:
            return state;
    }
}

/**
 * @param state global Redux state
 * @returns {object} state of login form
 */
export function getLoginState(state) {
    return state.login;
}
