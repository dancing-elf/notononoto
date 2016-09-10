import React, {Component} from "react";
import axios from "axios";


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
        var nodes = this.state.data.map(function(post) {
            return (
                <div key={post.id} className="post">
                    <div>{post.header}</div>
                    <div>{post.dateTime}</div>
                    <div>{post.content}</div>
                </div>
            );
        });
        return <div className="postsList">
            {nodes}
        </div>;
    }
}
