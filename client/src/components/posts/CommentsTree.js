import React, {PropTypes, Component} from "react";

import {formatDate} from "../../util/util";


export default class CommentsTree extends Component {
    render() {
        return <div>
            <div className="commentTitle">コメント</div>
            <table>
                {this.props.comments.map(function (comment) {
                    return <tr key={comment.id} className="comment">
                        <td>{comment.id}.</td>
                        <td>
                            <div>{comment.text}</div>
                            <div className="commentBox">
                                <span>{comment.author}</span>
                                <span>{formatDate(comment.timestamp)}</span>
                            </div>
                            <div className="answerBox">
                                <a href="#commentInput">答え</a>
                                <a href="#commentInput">引用</a>
                            </div>
                        </td>
                    </tr>;
                })}
            </table>
        </div>;
    }
}

CommentsTree.propTypes = {
    comments: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        parentId: PropTypes.number,
        author: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
    })).isRequired
};