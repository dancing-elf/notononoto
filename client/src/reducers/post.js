import axios from "axios";

import {copy} from "../util/util";
import {LOAD_POST, UPDATE_COMMENTS} from "../constants/ActionTypes";

const initialState = {
    postId: "",
    post: {
        timestamp: "",
        header: "",
        content: ""
    },
    comments: []
};

export function post(state = initialState, action) {
    switch (action.type) {
        case LOAD_POST:
            return copy(state, {
                postId: action.postId,
                post: action.post,
                comments: action.comments
            });
        case UPDATE_COMMENTS:
            return copy(state, {comments: action.comments});
        default:
            return state;
    }
}

export function getPost(state) {
    return state.post.post;
}

export function getComments(state) {
    return state.post.comments;
}

export function getPostId(state) {
    return state.post.postId;
}

export function loadPost(postId, dispatch) {
    axios.get("/api/post/" + postId)
        .then(function (response) {
            dispatch({
                type: LOAD_POST,
                postId: postId,
                post: response.data.post,
                comments: response.data.comments});
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function updateComments(comments, dispatch) {
    dispatch({
        type: UPDATE_COMMENTS,
        comments: comments
    });
}
