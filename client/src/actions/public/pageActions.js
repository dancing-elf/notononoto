import {NOT_FOUND, LOAD_ERROR, RESET_PAGE_STATE} from "../ActionTypes";

/**
 * @returns {object} reset page state
 */
export function createResetPageStateAction() {
    return {type: RESET_PAGE_STATE};
}

/**
 * Handle axios error
 * @param dispatch Redux dispatch
 * @param error axios error
 */
export function handleError(dispatch, error) {
    if (error.response) {
        if (error.response.status === 404) {
            dispatch(createNotFoundAction());
        } else {
            dispatch(createLoadErrorAction(
                error.response.status + ": " +
                error.response.statusText));
        }
    } else {
        dispatch(createLoadErrorAction(error.message));
    }
}

/**
 * @returns {object} action to display "not found" message
 */
function createNotFoundAction() {
    return {type: NOT_FOUND};
}

/**
 * @returns {object} action to display error
 */
function createLoadErrorAction(message) {
    return {type: LOAD_ERROR, message: message};
}
