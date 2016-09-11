import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, browserHistory} from "react-router";

import "./index.css";
import CommonLayout from "./containers/CommonLayout";
import PostsList from "./containers/PostsList";
import Post from "./containers/Post";


ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={CommonLayout}>
            <IndexRoute component={PostsList}/>
            <Route path="posts/:postId" component={Post}/>
        </Route>
    </Router>,
    document.getElementById("root")
);