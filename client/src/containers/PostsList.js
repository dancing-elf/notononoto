import React, {Component} from "react";
import {Link} from "react-router";
import axios from "axios";

import {formatDate} from "../util/util"


/** List of posts */
export default class PostsList extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
    }
    componentDidMount() {
        const self = this;
        axios.get("/api/posts")
            .then(function (response) {
                self.setState({data: response.data});
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    render() {
        const nodes = this.state.data.map(function(post) {
            return (
                <div key={post.id} className="postPreview">
                    <div className="dateTime">{formatDate(post.dateTime)}</div>
                    <div className="title">{post.header}</div>
                    <div>{post.content}</div>
                    <Link to={"/posts/" + post.id}>続きを読む...</Link>
                </div>
            );
        });
        return <div>
            {nodes}
        </div>;
    }
}
