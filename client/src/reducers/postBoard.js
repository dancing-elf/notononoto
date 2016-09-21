import {copy} from "../util/util";
import {LOAD_POSTS} from "../actions/ActionTypes";

const initialState = { posts: [] };

/**
 * Reducer of PostBoard component
 * @param state PostBoard's state
 * @param action action to do
 * @returns {*} new state after doing action
 */
export function postBoard(state = initialState, action) {
    switch (action.type) {
        case LOAD_POSTS:
            return copy(state, {posts: action.posts});
        default:
            return state;
    }
}

/**
 * @param state global redux state
 * @returns {array} list of available posts
 */
export function getPosts(state) {
    return state.postBoard.posts;
}
