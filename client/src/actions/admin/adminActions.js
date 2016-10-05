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
                postId: postId,
                post: response.data.post,
                comments: response.data.comments
            });
        }).catch(function (error) {
            handleError(dispatch, error);
        });
    };
}
