import React, {PropTypes, Component} from "react";
import axios from "axios";


/** Post description */
export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {data: {post: "", comments: []}};
    }
    componentDidMount() {
        const self = this;
        axios.get("/api/post/" + this.props.params.postId)
            .then(function (response) {
                self.setState({data: response.data});
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    render() {
        const state = this.state.data;
        const commentsNode = state.comments.map(function(comment) {
            return <div key={comment.id}>
		<div>{comment.dateTime}</div>
                <div>{comment.author}</div>
                <div>{comment.dataTime}</div>
                <div>{comment.text}</div>
            </div>;
        });
        return <div>
            <div>{state.post.header}</div>
            <div>{state.post.dataTime}</div>
            <div>{state.post.content}</div>
            <div>コメント</div>
            <div>{commentsNode}</div>
        </div>;
    }
}

Post.propTypes = {
    params: PropTypes.shape({
        postId: PropTypes.string.isRequired,
    })
};
