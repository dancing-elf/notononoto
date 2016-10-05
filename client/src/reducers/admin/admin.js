import {copy} from "../../util/util";
import {
    OPEN_POST,
    OPEN_POSTS_LIST
} from "../../actions/ActionTypes";

export const POSTS_LIST = "POSTS_LIST";
export const POST_DATA = "POST_DATA";

const initialState = {
    state: POSTS_LIST,
};

/**
 * Reducer of admin page state
 * @param state page state
 * @param action action to do
 * @returns {*} new state after doing action
 */
export function admin(state = initialState, action) {
    switch (action.type) {
        case OPEN_POST:
            return copy(state, {state: POST_DATA});
        case OPEN_POSTS_LIST:
            return copy(state, {state: POSTS_LIST});
        default:
            return state;
    }
}

/**
 * @param state global redux state
 * @returns {object} post data
 */
export function getAdminState(state) {
    return state.admin;
}