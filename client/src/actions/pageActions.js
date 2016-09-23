import {NOT_FOUND, LOAD_ERROR} from "./ActionTypes";

/**
 * @returns {object} action to display "not found" message
 */
export function createNotFoundAction() {
    return {type: NOT_FOUND};
}

/**
 * @returns {object} action to display error
 */
export function createLoadErrorAction(message) {
    return {type: LOAD_ERROR, message: message};
}
