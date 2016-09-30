import {combineReducers} from "redux";
import {page} from "./page";
import {postBoard} from "./postBoard";
import {post} from "./post";
import {commentForm} from "./commentForm";
import {auth} from "./auth";

import {RESET_PAGE_STATE} from "../actions/ActionTypes";

/** Object for application state management */
const appReducer = combineReducers({
    page,
    postBoard,
    post,
    commentForm,

    auth
});

/** We need opportunity to reset state of Redux */
export default function rootReducer(state, action) {
    if (action.type === RESET_PAGE_STATE) {
        state = undefined;
    }
    return appReducer(state, action);
}
