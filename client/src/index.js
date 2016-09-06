import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainLayout from "./containers/MainLayout";

ReactDOM.render(
    <MainLayout>
        <div>Post1</div>
        <div>Post2</div>
    </MainLayout>,
    document.getElementById("root")
);