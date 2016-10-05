import {copy} from "../../util/util";

import {
    UPDATE_LOGIN,
    UPDATE_PASSWORD,
    FAIL_SIGN_IN,
    SIGN_IN
} from "../../actions/ActionTypes";


const initialState = {
    login: "",
    password: "",
    isLogged: false,
    // This property is not equal to "isLogged" because we
    // shouldn's display error message before first attempt
    // to login
    hasError: false
};

/**
 * Reducer of login form component
 * @param state state of login form
 * @param action action to do
 * @returns {*} new state after doing action
 */
export function auth(state = initialState, action) {
    switch (action.type) {
        case UPDATE_LOGIN:
            return action.value.length >= 50 ?
                state : copy(state, {login: action.value});
        case UPDATE_PASSWORD:
            return action.value.length >= 50 ?
                state : copy(state, {password: action.value});
        case FAIL_SIGN_IN:
            return copy(state, {hasError: true});
        case SIGN_IN:
            return copy(state, {isLogged: true});
        default:
            return state;
    }
}

/**
 * @param state global Redux state
 * @returns {object} state of login form
 */
export function getAuthState(state) {
    return state.auth;
}
