import axios from "axios";

import {copy} from "../util/util";

import {updateComments} from "./post";
import {
    REPLY_COMMENT,
    QUOTE_COMMENT,
    UPDATE_AUTHOR,
    UPDATE_EMAIL,
    UPDATE_COMMENT,
    CLEAN_COMMENT_FORM,
    COMMENT_INVALID
} from "../constants/ActionTypes";

const initialState = {
    authorValue: "",
    authorHasError: false,
    authorHasFocus: false,
    emailValue: "",
    emailHasError: false,
    emailHasFocus: false,
    commentValue: "",
    commentHasError: false,
    commentHasFocus: false,
};

export function commentForm(state = initialState, action) {
    switch (action.type) {
        case UPDATE_AUTHOR:
            return action.value.length >= 50 ?
                state : copy(state, {authorValue: action.value});
        case UPDATE_EMAIL:
            return action.value.length >= 50 ?
                state : copy(state, {emailValue: action.value});
        case UPDATE_COMMENT:
            return action.value.length >= 10000 ?
                state : copy(state, {commentValue: action.value});
        case REPLY_COMMENT:
            return copy(state, {
                commentValue: "<b>" + action.author + "</b>" + state.commentValue,
                authorHasFocus: false,
                emailHasFocus: false,
                commentHasFocus: true
            });
        case QUOTE_COMMENT:
            return copy(state, {
                commentValue: "<b>" + action.comment + "</b>" + state.commentValue,
                authorHasFocus: false,
                emailHasFocus: false,
                commentHasFocus: true
            });
        case CLEAN_COMMENT_FORM:
            return initialState;
        case COMMENT_INVALID:
            return copy(state, {
                authorHasError: action.authorHasError,
                emailHasError: action.emailHasError,
                commentHasError: action.commentHasError,

                authorHasFocus: action.authorHasFocus,
                emailHasFocus: action.emailHasFocus,
                commentHasFocus: action.commentHasFocus
            });
        default:
            return state;
    }
}

export function getInputState(state) {
    return state.commentForm;
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
        const author = getState().commentForm.authorValue.trim();
        const email = getState().commentForm.emailValue.trim();
        const comment = getState().commentForm.commentValue.trim();

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
                updateComments(response.data, dispatch);
                dispatch({
                    type: CLEAN_COMMENT_FORM
                });
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            dispatch({
                type: COMMENT_INVALID,
                authorHasError: authorHasError,
                emailHasError: emailHasError,
                commentHasError: commentHasError,

                authorHasFocus: authorHasError,
                emailHasFocus: !authorHasError && emailHasError,
                commentHasFocus: !authorHasError && !emailHasError && commentHasError
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
