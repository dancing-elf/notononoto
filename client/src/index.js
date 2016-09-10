import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import CommonLayout from "./containers/CommonLayout";
import PostsList from "./containers/PostsList"

ReactDOM.render(
    <CommonLayout>
        <PostsList/>
    </CommonLayout>,
    document.getElementById("root")
);