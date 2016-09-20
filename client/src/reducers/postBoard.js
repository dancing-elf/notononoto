import axios from "axios";

import {copy} from "../util/util";
import {LOAD_POSTS} from "../constants/ActionTypes";

const initialState = { posts: [] };

export function postBoard(state = initialState, action) {
    switch (action.type) {
        case LOAD_POSTS: {
            return copy(state, {posts: action.posts});
        }
        default:
            return state;
    }
}

export function getPosts(state) {
    return state.postBoard.posts;
}

export function loadPosts(dispatch) {
    axios.get("/api/posts")
        .then(function (response) {
            dispatch({type: LOAD_POSTS, posts: response.data});
        })
        .catch(function (error) {
            console.log(error);
        });
}