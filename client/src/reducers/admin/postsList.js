import {copy} from "../../util/util";
import {LOAD_POSTS_DESC} from "../../actions/ActionTypes";

const initialState = { posts: [] };

/**
 * Reducer of PostList component
 * @param state PostList's state
 * @param action action to do
 * @returns {*} new state after doing action
 */
export function postsList(state = initialState, action) {
    switch (action.type) {
        case LOAD_POSTS_DESC:
            return copy(state, {posts: action.posts});
        default:
            return state;
    }
}

/**
 * @param state global redux state
 * @returns {array} list of available posts
 */
export function getPostsDesc(state) {
    return state.postsList.posts;
}
