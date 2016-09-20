import {combineReducers} from "redux";
import {postBoard} from "./postBoard";
import {post} from "./post";
import {commentForm} from "./commentForm";

export default combineReducers({
    postBoard,
    post,
    commentForm
});