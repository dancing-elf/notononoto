import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";

import Article from "./Article";
import CommentsTree from "./CommentsTree";
import CommentForm from "./CommentForm";
import {
    getPostState,
    getCommentsState
} from "../../reducers/public/post";
import {createLoadPostFunction} from "../../actions/public/postActions";


/** Post description */
export class Post extends Component {
    componentDidMount() {
        this.props.loadPost(this.props.params.postId);
    }
    render() {
        if (!this.props.post.timestamp) {
            // the data has not yet been loaded
            return <div></div>;
        }
        return <div>
            <Article post={this.props.post}/>
            <CommentsTree comments={this.props.comments}/>
            <CommentForm/>
        </div>;
    }
}

Post.propTypes = {
    params: PropTypes.shape({
        postId: PropTypes.number.isRequired
    }),
    post: PropTypes.object.isRequired,
    comments: PropTypes.array.isRequired,
    loadPost: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        post: getPostState(state),
        comments: getCommentsState(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadPost: createLoadPostFunction(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);
