import axios from "axios";

import {LOAD_POST, UPDATE_COMMENTS} from "../ActionTypes";
import {handleError} from "./pageActions";

/**
 * @param dispatch Redux dispatch
 * @returns {function} get post data from server
 */
export function createLoadPostFunction(dispatch) {
    return (postId) => {
        axios.get("/api/public/post/" + postId)
            .then(function (response) {
                dispatch({
                    type: LOAD_POST,
                    postId: postId,
                    post: response.data.post,
                    comments: response.data.comments
                });
            })
            .catch(function (error) {
                handleError(dispatch, error);
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