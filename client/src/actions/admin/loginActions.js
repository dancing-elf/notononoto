import axios from "axios";

import {
    UPDATE_LOGIN,
    UPDATE_PASSWORD,
    SIGN_IN,
    FAIL_SIGN_IN,
    OPEN_POSTS_LIST
} from "../ActionTypes";

import {getAuthState} from "../../reducers/admin/auth";

/**
 * @param dispatch Redux dispatch method
 * @returns {function} replace login value with new value
 */
export function createUpdateLoginFunction(dispatch) {
    return (value) => dispatch({type: UPDATE_LOGIN, value: value});
}

/**
 * @param dispatch Redux dispatch method
 * @returns {function} replace password value with new value
 */
export function createUpdatePasswordFunction(dispatch) {
    return (value) => dispatch({type: UPDATE_PASSWORD, value: value});
}

/**
 * @returns {*} open post list action
 */
export function createOpenPostsListAction() {
    return {type: OPEN_POSTS_LIST};
}

/**
 * Submit login and password
 */
export function submitLogin() {
    return (dispatch, getState) => {
        const authState = getAuthState(getState());
        const login = authState.login.trim();
        const password = authState.password.trim();

        axios.get("/api/admin/login", {
            auth: {
                username: login,
                password: password
            }
        }).then(function () {
            dispatch({type: SIGN_IN});
            dispatch(createOpenPostsListAction());
        }).catch(function () {
            dispatch({type: FAIL_SIGN_IN});
        });
    };
}
