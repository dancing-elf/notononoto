import {combineReducers} from "redux";
import {page} from "./page";
import {postBoard} from "./postBoard";
import {post} from "./post";
import {commentForm} from "./commentForm";

/** Object for global Redux state management */
export default combineReducers({
    page,
    postBoard,
    post,
    commentForm
});