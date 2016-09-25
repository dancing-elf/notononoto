import axios from "axios";
import {browserHistory} from "react-router";

import {
    UPDATE_LOGIN,
    UPDATE_PASSWORD,
    ERROR_LOGIN
} from "../actions/ActionTypes";

import {getLoginState} from "../reducers/login";

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
 * Submit login and password
 */
export function submitLogin() {
    return (dispatch, getState) => {
        const loginState = getLoginState(getState());
        const login = loginState.loginValue.trim();
        const password = loginState.passwordValue.trim();

        axios.get("/api/admin/login", {
            auth: {
                username: login,
                password: password
            }
        }).then(function () {
            browserHistory.push("/admin/control_panel");
        }).catch(function () {
            dispatch({type: ERROR_LOGIN});
        });
    };
}
