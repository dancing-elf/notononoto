import axios from "axios";

import {
    REPLY_COMMENT,
    QUOTE_COMMENT,
    UPDATE_AUTHOR,
    UPDATE_EMAIL,
    UPDATE_COMMENT,
    CLEAN_COMMENT_FORM,
    COMMENT_INVALID,
    SEND_COMMENT_ERROR,
    RESET_FOCUS
} from "../actions/ActionTypes";
import {
    AUTHOR_INPUT,
    EMAIL_INPUT,
    COMMENT_INPUT,
} from "../reducers/commentForm";

import {getPostIdState} from "../reducers/post";
import {createUpdateCommentsAction} from "./postActions";

/**
 * @param dispatch Redux dispatch method
 * @returns {function} replace author value with new value
 */
export function createUpdateAuthorFunction(dispatch) {
    return (value) => dispatch({type: UPDATE_AUTHOR, value: value});
}

/**
 * @param dispatch Redux dispatch method
 * @returns {function} replace email value with new value
 */
export function createUpdateEmailFunction(dispatch) {
    return (value) => dispatch({type: UPDATE_EMAIL, value: value});
}

/**
 * @param dispatch Redux dispatch method
 * @returns {function} replace comment value with new value
 */
export function createUpdateCommentFunction(dispatch) {
    return (value) => dispatch({type: UPDATE_COMMENT, value: value});
}

export function createResetFocusFunction(dispatch) {
    return () => dispatch({type: RESET_FOCUS});
}
/**
 * @param dispatch Redux dispatch method
 * @returns {function} make reply to specified author
 */
export function createAnswerFunction(dispatch) {
    return (author) => dispatch({type: REPLY_COMMENT, author: author});
}

/**
 * @param dispatch Redux dispatch method
 * @returns {function} quote specified comment
 */
export function createQuoteFunction(dispatch) {
    return (author, comment) => dispatch({
        type: QUOTE_COMMENT,
        author: author,
        comment: comment
    });
}

/**
 * @returns {function} validate and submit comment form
 */
export function createSubmitCommentAction() {
    return (dispatch, getState) => {
        const author = getState().commentForm.authorValue.trim();
        const email = getState().commentForm.emailValue.trim();
        const comment = getState().commentForm.commentValue.trim();

        const emailHasError = ! validateEmail(email);
        const authorHasError = ! validateAuthor(author);
        const commentHasError = ! validateComment(comment);

        if (!authorHasError && !emailHasError && !commentHasError) {
            addNewComment(
                getPostIdState(getState()), author, email, comment, dispatch);
        } else {
            dispatch(createCommentInvalidAction(
                authorHasError, emailHasError, commentHasError));
        }
    };
}

/**
 * @returns {object} action for invalid comment form state
 */
function createCommentInvalidAction(authorHasError,
                                    emailHasError,
                                    commentHasError) {
    let focusInput = undefined;
    if (authorHasError) {
        focusInput = AUTHOR_INPUT;
    } else if (emailHasError) {
        focusInput = EMAIL_INPUT;
    } else if (commentHasError) {
        focusInput = COMMENT_INPUT;
    } else {
        throw Error("One of inputs should have error");
    }
    return {
        type: COMMENT_INVALID,
        authorHasError: authorHasError,
        emailHasError: emailHasError,
        commentHasError: commentHasError,
        focusInput: focusInput,
    };
}

/**
 * Send comment form's data to server and handle result
 */
function addNewComment(postId, author, email, comment, dispatch) {
    axios.post("/api/public/new_comment", {
        postId: postId,
        author: author,
        email: email,
        text: comment
    }).then(function (response) {
        dispatch(createUpdateCommentsAction(response.data));
        dispatch({type: CLEAN_COMMENT_FORM});
    }).catch(function () {
        dispatch({type: SEND_COMMENT_ERROR});
    });
}

function validateAuthor(value) {
    return value ? true : false;
}

function validateComment(value) {
    return value ? true : false;
}

function validateEmail(value) {
    // not perfect but relatively simple.
    // html5 validation in react with firefox highlight input as error
    // before submission. Complex regexp should be implemented on server
    // side too. In any case this email is not very important
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
