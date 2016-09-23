import axios from "axios";

import {LOAD_POST, UPDATE_COMMENTS} from "./ActionTypes";
import {createLoadErrorAction, createNotFoundAction} from "./pageActions";

/**
 * @param dispatch Redux dispatch
 * @returns {function} get post data from server
 */
export function createLoadPostFunction(dispatch) {
    return (postId) => {
        axios.get("/api/post/" + postId)
            .then(function (response) {
                dispatch({
                    type: LOAD_POST,
                    postId: postId,
                    post: response.data.post,
                    comments: response.data.comments
                });
            })
            .catch(function (error) {
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
            });
    };
}

/**
 * @param comments new comments
 * @returns {object} action to update comments on view
 */
export function createUpdateCommentsAction(comments) {
    return {
        type: UPDATE_COMMENTS,
        comments: comments
    };
}