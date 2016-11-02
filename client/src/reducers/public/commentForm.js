import {copy} from "../../util/util";

import {
    REPLY_COMMENT,
    QUOTE_COMMENT,
    UPDATE_AUTHOR,
    UPDATE_EMAIL,
    UPDATE_COMMENT,
    CLEAN_COMMENT_FORM,
    COMMENT_INVALID,
    RESET_FOCUS,
    SEND_COMMENT_ERROR
} from "../../actions/ActionTypes";

// Constants for using with focusInput property
export const AUTHOR_INPUT = "AUTHOR_INPUT";
export const EMAIL_INPUT = "EMAIL_INPUT";
export const COMMENT_INPUT = "COMMENT_INPUT";
export const USER_DEFINED = "USER_DEFINED";


const initialState = {
    authorValue: "",
    authorHasError: false,

    emailValue: "",
    emailHasError: false,

    commentValue: "",
    commentHasError: false,
    // Current element with focus
    focusInput: USER_DEFINED,
    // When sending a message errors occurred
    isSendOk: true
};

/**
 * Reducer of CommentForm component
 * @param state CommentForm's state
 * @param action action to do
 * @returns {*} new state after doing action
 */
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
                commentValue: "@" + action.author + ", " + state.commentValue,
                focusInput: COMMENT_INPUT
            });
        case QUOTE_COMMENT:
            return copy(state, {
                commentValue: "「" + action.comment + "」" + state.commentValue,
                focusInput: COMMENT_INPUT
            });
        case CLEAN_COMMENT_FORM:
            return initialState;
        case COMMENT_INVALID:
            return copy(state, {
                authorHasError: action.authorHasError,
                emailHasError: action.emailHasError,
                commentHasError: action.commentHasError,
                focusInput: action.focusInput,
                isSendOk: true
            });
        case RESET_FOCUS:
            return copy(state, {focusInput: USER_DEFINED});
        case SEND_COMMENT_ERROR:
            return copy(state, {
                authorHasError: false,
                emailHasError: false,
                commentHasError: false,
                isSendOk: false
            });
        default:
            return state;
    }
}

/**
 * @param state global Redux state
 * @returns {object} state of comment form
 */
export function getCommentFormState(state) {
    return state.commentForm;
}
