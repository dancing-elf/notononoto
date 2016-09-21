import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";

import {getPosts} from "../../reducers/postBoard";
import {createLoadPostsFunction} from "../../actions/postBoardActions";
import {formatDate} from "../../util/util";


/** List of posts */
class PostBoard extends Component {
    componentDidMount() {
        this.props.loadPosts();
    }
    render() {
        return <div>
            {this.props.posts.map(function (post) {
                return (
                    <div key={post.id} className="postPreview">
                        <div className="dateTime">
                            {formatDate(post.timestamp)}
                        </div>
                        <div className="title">
                            {post.header}
                        </div>
                        <div>
                            {post.content}
                        </div>
                        <Link to={"/posts/" + post.id}>
                            続きを読む...
                        </Link>
                    </div>
                );
            })}
        </div>;
    }
}

PostBoard.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        timestamp: PropTypes.string.isRequired,
        header: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
    })).isRequired,
    loadPosts: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        posts: getPosts(state)
    };
};

function mapDispatchToProps(dispatch) {
    return {
        loadPosts: createLoadPostsFunction(dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostBoard);