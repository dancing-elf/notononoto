import {copy} from "../../util/util";
import {
    OPEN_POST,
    UPDATE_HEADER,
    UPDATE_CONTENT,
    POST_SAVE_SUCCESS,
    POST_SAVE_ERROR
} from "../../actions/ActionTypes";

const initialState = {
    postId: "",
    post: {
        timestamp: "",
        header: "",
        content: ""
    },
    comments: [],
    postSaveSuccess: false,
    postSaveError: false
};

/**
 * Reducer of PostData component
 * @param state post's state
 * @param action action to do
 * @returns {*} new state after doing action
 */
export function postData(state = initialState, action) {
    switch (action.type) {
        case OPEN_POST:
            return copy(state, {
                postId: action.postId,
                post: action.post,
                comments: action.comments
            });
        case UPDATE_HEADER:
            return copy(state, {
                post: copy(state.post, {header: action.value})
            });
        case UPDATE_CONTENT:
            return copy(state, {
                post: copy(state.post, {content: action.value})
            });
        case POST_SAVE_SUCCESS:
            return copy(state, {postSaveSuccess: true, postSaveError: false});
        case POST_SAVE_ERROR:
            return copy(state, {postSaveError: true, postSaveSuccess: false});
        default:
            return state;
    }
}

/**
 * @param state global redux state
 * @returns {object} post data
 */
export function getPostState(state) {
    return state.postData.post;
}

/**
 * @param state global redux state
 * @returns {array} post's comment
 */
export function getCommentsState(state) {
    return state.postData.comments;
}

/**
 * @param state global redux state
 * @returns {string} post id
 */
export function getPostIdState(state) {
    return state.postData.postId;
}
