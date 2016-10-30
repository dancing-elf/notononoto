import axios from "axios";
import {LOAD_POSTS_DESC, OPEN_POST} from "../ActionTypes";
import {handleError} from "../public/pageActions";

/**
 * @param dispatch Redux dispatch
 * @returns {function} get all available posts descriptions from server
 */
export function createLoadPostsDescFunction(dispatch) {
    return (authToken) => {
        axios.get("/api/admin/posts", {
            auth: {
                username: authToken.login,
                password: authToken.password
            }
        }).then(function (response) {
            dispatch({type: LOAD_POSTS_DESC, posts: response.data});
        }).catch(function (error) {
            handleError(dispatch, error);
        });
    };
}

/**
 * @param dispatch Redux dispatch
 * @returns {function} open edit post page
 */
export function createOpenPostFunction(dispatch) {
    return (postId, authToken) => {
        axios.get("/api/admin/post/" + postId, {
            auth: {
                username: authToken.login,
                password: authToken.password
            }
        }).then(function (response) {
            dispatch({
                type: OPEN_POST,
                postId: postId.toString(),
                post: response.data.post,
                comments: response.data.comments
            });
        }).catch(function (error) {
            handleError(dispatch, error);
        });
    };
}

/**
 * @param dispatch Redux dispatch method
 * @returns {function} open post edit panel with empty data
 */
export function createOpenNewPostPanelFunction(dispatch) {
    return () => dispatch({
        type: OPEN_POST,
        postId: null,
        post: {
            timestamp: "",
            header: "",
            content: ""
        },
        comments: []
    });
}