import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {Router, Route, IndexRoute, browserHistory} from "react-router";

import "./index.css";
import CommonLayout from "./components/common/CommonLayout";
import PostBoard from "./components/root/PostBoard";
import Post from "./components/posts/Post";
import configureStore from "./store/configureStore";

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={CommonLayout}>
                <IndexRoute component={PostBoard}/>
                <Route path="posts/:postId" component={Post}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById("root")
);