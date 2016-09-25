import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {Router, Route, IndexRoute, browserHistory} from "react-router";

import "./index.css";

import CommonLayout from "./components/common/CommonLayout";
import PostBoard from "./components/index/PostBoard";
import Post from "./components/posts/Post";
import About from "./components/about/About";
import NotFoundError from "./components/errors/NotFoundError";

import Login from "./components/admin/Login";
import ControlPanel from "./components/admin/ControlPanel";

import {createResetPageStateAction} from "./actions/pageActions";
import configureStore from "./store/configureStore";


const store = configureStore();

// we should reset page state, because Redux share state between
// all pages. It's share page errors, inputs and etc. We don't
// need this
function resetPageState() {
    store.dispatch(createResetPageStateAction());
}

ReactDOM.render(
    <Provider store={store}>
        <Router onUpdate={resetPageState} history={browserHistory}>
            <Route path="/" component={CommonLayout}>
                <IndexRoute component={PostBoard}/>
                <Route path="posts/:postId" component={Post}/>
                <Route path="about" component={About}/>
                <Route path="admin">
                    <IndexRoute component={Login}/>
                    <Route path="control_panel" component={ControlPanel}/>
                </Route>
                <Route path="*" component={NotFoundError}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById("root")
);