import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, browserHistory} from "react-router";

import "./index.css";
import CommonLayout from "./components/common/CommonLayout";
import PostBoard from "./components/root/PostBoard";
import Post from "./components/posts/Post";


ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={CommonLayout}>
            <IndexRoute component={PostBoard}/>
            <Route path="posts/:postId" component={Post}/>
        </Route>
    </Router>,
    document.getElementById("root")
);