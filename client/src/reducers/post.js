import axios from "axios";

import {
    REPLY_COMMENT,
    QUOTE_COMMENT,
    LOAD_POST,
    UPDATE_AUTHOR,
    UPDATE_EMAIL,
    UPDATE_COMMENT,
    UPDATE_COMMENTS,
    COMMENT_INVALID
} from "../constants/ActionTypes";

const initialState = {
    postId: "",
    post: {
        timestamp: "",
        header: "",
        content: ""
    },
    comments: [],
    authorValue: "",
    authorHasError: false,
    emailValue: "",
    emailHasError: false,
    commentValue: "",
    commentHasError: false,
};

export function post(state = initialState, action) {
    switch (action.type) {
        case LOAD_POST:
            return Object.assign({}, state, {
                postId: action.postId,
                post: action.post,
                comments: action.comments
            });
        case UPDATE_AUTHOR:
            return action.value.length >= 50 ?
                state : Object.assign({}, state, {authorValue: action.value});
        case UPDATE_EMAIL:
            return action.value.length >= 50 ?
                state : Object.assign({}, state, {emailValue: action.value});
        case UPDATE_COMMENT:
            return action.value.length >= 10000 ?
                state : Object.assign({}, state, {commentValue: action.value});
        case REPLY_COMMENT:
            return Object.assign({}, state,
                {commentValue: "<b>" + action.author + "</b>" + state.commentValue});
        case QUOTE_COMMENT:
            return Object.assign({}, state,
                {commentValue: "<b>" + action.comment + "</b>" + state.commentValue});
        case UPDATE_COMMENTS:
            return Object.assign({}, state, {
                comments: action.comments,
                authorValue: "",
                authorHasError: false,
                emailValue: "",
                emailHasError: false,
                commentValue: "",
                commentHasError: false
            });
        case COMMENT_INVALID:
            return Object.assign({}, state, {
                authorHasError: action.authorHasError,
                emailHasError: action.emailHasError,
                commentHasError: action.commentHasError
            });
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

export function getInputState(state) {
    return {
        authorValue: state.post.authorValue,
        authorHasError: state.post.authorHasError,
        emailValue: state.post.emailValue,
        emailHasError: state.post.emailHasError,
        commentValue: state.post.commentValue,
        commentHasError: state.post.commentHasError
    };
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

export function updateAuthor(dispatch) {
    return (value) => dispatch({type: UPDATE_AUTHOR, value: value});
}

export function updateEmail(dispatch) {
    return (value) => dispatch({type: UPDATE_EMAIL, value: value});
}

export function updateComment(dispatch) {
    return (value) => dispatch({type: UPDATE_COMMENT, value: value});
}

export function submitCommentForm() {
    return (dispatch, getState) => {
        const author = getState().post.authorValue.trim();
        const email = getState().post.emailValue.trim();
        const comment = getState().post.commentValue.trim();

        let commentHasError = false;
        let emailHasError = false;
        let authorHasError = false;

        if (!comment) {
            commentHasError = true;
        }
        // not perfect but relatively simple.
        // html5 validation in react with firefox highlight input as error
        // before submission. Complex regexp should be implemented on server
        // side too. In any case this email is not very important
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailHasError = true;
        }
        if (!author) {
            authorHasError = true;
        }
        if (!authorHasError && !emailHasError && !commentHasError) {
            axios.post("/api/new_comment", {
                postId: getState().post.postId,
                author: author,
                email: email,
                text: comment
            }).then(function (response) {
                dispatch({
                    type: UPDATE_COMMENTS,
                    comments: response.data
                });
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            dispatch({
                type: COMMENT_INVALID,
                authorHasError: authorHasError,
                emailHasError: emailHasError,
                commentHasError: commentHasError
            });
        }
    };
}

export function makeAnswer(dispatch) {
    return (author) => dispatch({type: REPLY_COMMENT, author: author});
}

export function makeQuote(dispatch) {
    return (author, comment) => dispatch({
        type: QUOTE_COMMENT,
        author: author,
        comment: comment
    });
}
