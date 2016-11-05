import axios from "axios";

import {
    UPDATE_HEADER,
    UPDATE_CONTENT,
    POST_SAVE_SUCCESS,
    POST_SAVE_ERROR,
    FILE_LOAD_INFO_CLEANUP,
    FILE_LOAD_SUCCESS,
    FILE_LOAD_ERROR,
    UPDATE_IMAGES_LIST
} from "../ActionTypes";
import {createOpenPostsListAction} from "./loginActions";
import {getAuthState} from "../../reducers/admin/auth";
import {handleError} from "../public/pageActions";


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

/**
 * @returns {function} create or update post
 */
export function createSubmitPostDataAction() {
    return (dispatch, getState) => {
        const postData = getState().postData;
        const authToken = getAuthState(getState());

        if (postData.postId == null) {
            createPost(postData, authToken, dispatch);
        } else {
            updatePost(postData, authToken, dispatch);
        }
    };
}

function createPostDataErrorAction() {
    return {type: POST_SAVE_ERROR};
}

/**
 * Create new post on server
 * @param postData data of new post
 * @param authToken login and password
 * @param dispatch Redux dispatch method
 */
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

/**
 * Update post on server
 * @param postData new post data
 * @param authToken login and password
 * @param dispatch Redux dispatch method
 */
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

/**
 * @param files list of loaded files
 * @returns {function} save files to the server
 */
export function createUploadFilesAction(files) {
    return (dispatch, getState) => {

        const postData = getState().postData;
        const authToken = getAuthState(getState());

        dispatch(createFileLoadErrorsCleanupAction());
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            sendFile(postData.postId, authToken, file, dispatch);
        }
    };
}

/**
 * Send file to server
 * @param postId id of current post
 * @param authToken login and password
 * @param file data
 * @param dispatch Redux dispatch method
 */
function sendFile(postId, authToken, file, dispatch) {

    const data = new FormData();
    data.append("file", file);

    axios.post("/api/admin/upload_file/" + postId, data, {
        auth: {
            username: authToken.login,
            password: authToken.password
        }
    }).then(function () {
        dispatch(createFileLoadSuccessAction(file.name));
        dispatch(createLoadImagesNamesAction());
    }).catch(function () {
        dispatch(createFileLoadErrorAction(file.name));
    });
}

function createFileLoadErrorsCleanupAction() {
    return {type: FILE_LOAD_INFO_CLEANUP};
}

function createFileLoadSuccessAction(fileName) {
    return {type: FILE_LOAD_SUCCESS, fileName: fileName};
}

function createFileLoadErrorAction(fileName) {
    return {type: FILE_LOAD_ERROR, fileName: fileName};
}

/**
 * @returns {function} load names of images from server
 */
export function createLoadImagesNamesAction() {
    return (dispatch, getState) => {

        const postData = getState().postData;
        const authToken = getAuthState(getState());

        // post id not created yet
        if (!postData.postId) {
            return;
        }

        axios.get("/api/admin/upload_file/" + postData.postId, {
            auth: {
                username: authToken.login,
                password: authToken.password
            }
        }).then(function (response) {
            dispatch({type: UPDATE_IMAGES_LIST, images: response.data});
        }).catch(function (error) {
            handleError(dispatch, error);
        });
    };
}