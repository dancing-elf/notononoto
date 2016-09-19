import {combineReducers} from "redux";
import {postBoard} from "./postBoard";
import {post} from "./post";

export default combineReducers({
    postBoard,
    post
});