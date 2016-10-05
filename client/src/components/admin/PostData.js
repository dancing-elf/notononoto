import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import {
    getPostIdState,
    getPostState,
    getCommentsState
} from "../../reducers/admin/postData";
import {getAuthState} from "../../reducers/admin/auth";

import {formatDate} from "../../util/util";


/** Admin post edit form */
class PostData extends Component {
    render() {
        return <div>
            <div>
                <div>Creation time</div>
                <div className="dateTime">
                    {formatDate(this.props.post.timestamp)}
                </div>
                <div>Header</div>
                <div className="title">
                    {this.props.post.header}
                </div>
                <div>Content</div>
                <div>
                    {this.props.post.content}
                </div>
            </div>
            <div>Comments</div>
            <table>
                <tbody>
                {this.props.comments.map(function (comment) {
                    return <tr key={comment.id} className="comment">
                        <td>{comment.id}.</td>
                        <td>
                            <div>{comment.text}</div>
                            <div>
                                <span>{comment.author}</span>
                                <span>{formatDate(comment.timestamp)}</span>
                            </div>
                        </td>
                    </tr>;
                })}
                </tbody>
            </table>
        </div>;
    }
}

PostData.propTypes = {
    postId: PropTypes.number.isRequired,
    post: PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        header: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
    }).isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        parentId: PropTypes.number,
        author: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
    })).isRequired,
    authToken: PropTypes.shape({
        login: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired
    }).isRequired,
};

function mapStateToProps(state) {
    return {
        postId: getPostIdState(state),
        post: getPostState(state),
        comments: getCommentsState(state),
        authToken: getAuthState(state)
    };
}

export default connect(mapStateToProps)(PostData);
