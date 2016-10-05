import axios from "axios";
import {LOAD_POSTS} from "../ActionTypes";
import {handleError} from "./pageActions";

/**
 * @param dispatch Redux dispatch
 * @returns {function} get all available posts from server
 */
export function createLoadPostsFunction(dispatch) {
    return () => {
        axios.get("/api/public/posts")
            .then(function (response) {
                dispatch({type: LOAD_POSTS, posts: response.data});
            })
            .catch(function (error) {
                handleError(dispatch, error);
            });
    };
}