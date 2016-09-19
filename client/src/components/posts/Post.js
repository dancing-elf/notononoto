import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";

import {getPost, loadPost, getComments} from "../../reducers/post";
import Article from "./Article";
import CommentsTree from "./CommentsTree";
import CommentForm from "./CommentForm";

/** Post description */
export class Post extends Component {
    componentDidMount() {
        this.props.loadPost(this.props.params.postId);
    }
    render() {
        return <div>
            <Article post={this.props.post}/>
            <CommentsTree comments={this.props.comments}/>
            <CommentForm/>
        </div>;
    }
}

Post.propTypes = {
    params: PropTypes.shape({
        postId: PropTypes.string.isRequired
    }),
    post: PropTypes.object,
    comments: PropTypes.array,
    loadPost: PropTypes.func
};

function mapStateToProps(state) {
    return {
        post: getPost(state),
        comments: getComments(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadPost: (postId) => loadPost(postId, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);
