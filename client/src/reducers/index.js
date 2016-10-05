import {combineReducers} from "redux";
import {page} from "./public/page";
import {postBoard} from "./public/postBoard";
import {post} from "./public/post";
import {commentForm} from "./public/commentForm";

import {auth} from "./admin/auth";
import {admin} from "./admin/admin";
import {postsList} from "./admin/postsList";
import {postData} from "./admin/postData";

import {RESET_PAGE_STATE} from "../actions/ActionTypes";

/** Object for application state management */
const appReducer = combineReducers({
    page,
    postBoard,
    post,
    commentForm,

    auth,
    admin,
    postsList,
    postData
});

/** We need opportunity to reset state of Redux */
export default function rootReducer(state, action) {
    if (action.type === RESET_PAGE_STATE) {
        state = undefined;
    }
    return appReducer(state, action);
}
