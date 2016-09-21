import {combineReducers} from "redux";
import {postBoard} from "./postBoard";
import {post} from "./post";
import {commentForm} from "./commentForm";

/** Object for global Redux state management */
export default combineReducers({
    postBoard,
    post,
    commentForm
});