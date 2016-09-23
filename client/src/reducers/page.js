import {copy} from "../util/util";
import {NOT_FOUND, LOAD_ERROR} from "../actions/ActionTypes";

export const OK_STATE = "OK_STATE";
export const NOT_FOUND_STATE = "NOT_FOUND_STATE";
export const LOAD_ERROR_STATE = "LOAD_ERROR_STATE";

const initialState = {
    state: OK_STATE,
    message: ""
};

/**
 * Reducer of whole page state
 * @param state page state
 * @param action action to do
 * @returns {*} new state after doing action
 */
export function page(state = initialState, action) {
    switch (action.type) {
        case NOT_FOUND:
            return copy(state, {state: NOT_FOUND_STATE});
        case LOAD_ERROR:
            return copy(state, {
                state: LOAD_ERROR_STATE,
                message: action.message
            });
        default:
            return state;
    }
}

/**
 * @param state global redux state
 * @returns {object} post data
 */
export function getPageState(state) {
    return state.page;
}