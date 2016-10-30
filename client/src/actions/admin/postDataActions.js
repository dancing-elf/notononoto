import axios from "axios";

import {
    UPDATE_HEADER,
    UPDATE_CONTENT,
    POST_SAVE_SUCCESS,
    POST_SAVE_ERROR
} from "../ActionTypes";
import {createOpenPostsListAction} from "./loginActions";
import {getAuthState} from "../../reducers/admin/auth";


/**
 * @param dispatch Redux dispatch method
 * @returns {function} replace header value with new value
 */
export function createUpdatePostHeaderFunction(dispatch) {
    return (value) => dispatch({type: UPDATE_HEADER, value: value});
}

/**
 * @param dispatch Redux dispatch method
 * @returns {function} replace content value with new value
 */
export function createUpdatePostContentFunction(dispatch) {
    return (value) => dispatch({type: UPDATE_CONTENT, value: value});
}

export function createSubmitPostDataAction() {
    return (dispatch, getState) => {
        const postData = getState().postData;
        const postId = postData.postId;
        const authToken = getAuthState(getState());

        if (postId == null) {
            createPost(postData, authToken, dispatch);
        } else {
            updatePost(postData, authToken, dispatch);
        }
    };
}

function createPostDataErrorAction() {
    return {type: POST_SAVE_ERROR};
}

function createPost(postData, authToken, dispatch) {
    axios.post("/api/admin/new_post", {
        header: postData.post.header,
        content: postData.post.content,
    }, {
        auth: {
            username: authToken.login,
            password: authToken.password
        }
    }).then(function () {
        dispatch(createOpenPostsListAction());
    }).catch(function () {
        dispatch(createPostDataErrorAction());
    });
}

function updatePost(postData, authToken, dispatch) {
    axios.post("/api/admin/update_post", {
        postId: postData.postId,
        header: postData.post.header,
        content: postData.post.content,
    }, {
        auth: {
            username: authToken.login,
            password: authToken.password
        }
    }).then(function () {
        dispatch({type: POST_SAVE_SUCCESS});
    }).catch(function () {
        dispatch(createPostDataErrorAction());
    });
}