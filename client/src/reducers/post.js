import {copy} from "../util/util";
import {LOAD_POST, UPDATE_COMMENTS} from "../actions/ActionTypes";

const initialState = {
    postId: "",
    post: {
        timestamp: "",
        header: "",
        content: ""
    },
    comments: []
};

/**
 * Reducer of Post component
 * @param state post's state
 * @param action action to do
 * @returns {*} new state after doing action
 */
export function post(state = initialState, action) {
    switch (action.type) {
        case LOAD_POST:
            return copy(state, {
                postId: action.postId,
                post: action.post,
                comments: action.comments
            });
        case UPDATE_COMMENTS:
            return copy(state, {comments: action.comments});
        default:
            return state;
    }
}

/**
 * @param state global redux state
 * @returns {object} post data
 */
export function getPostState(state) {
    return state.post.post;
}

/**
 * @param state global redux state
 * @returns {array} post's comment
 */
export function getCommentsState(state) {
    return state.post.comments;
}

/**
 * @param state global redux state
 * @returns {string} post id
 */
export function getPostIdState(state) {
    return state.post.postId;
}
