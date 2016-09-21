import axios from "axios";
import {LOAD_POSTS} from "../actions/ActionTypes";

/**
 * @param dispatch Redux dispatch
 * @returns {function} get all available posts from server
 */
export function createLoadPostsFunction(dispatch) {
    return () => {
        axios.get("/api/posts")
            .then(function (response) {
                dispatch({type: LOAD_POSTS, posts: response.data});
            })
            .catch(function (error) {
                console.log(error);
            });
    };
}