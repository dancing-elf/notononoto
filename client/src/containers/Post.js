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
            return <div key={comment.id} className="comment">
                <div>
                    <span className="commentAuthor">{comment.author}</span>
                    <span className="dateTime">{comment.dateTime}</span>
                </div>
                <div>{comment.text}</div>
            </div>;
        });
        return <div>
            <div className="dateTime">{state.post.dateTime}</div>
            <div className="title">{state.post.header}</div>
            <div>{state.post.content}</div>
            <div className="commentTitle">コメント</div>
            <div>{commentsNode}</div>
        </div>;
    }
}

Post.propTypes = {
    params: PropTypes.shape({
        postId: PropTypes.string.isRequired,
    })
};
