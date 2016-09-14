import React, {PropTypes, Component} from "react";

import {formatDate} from "../../util/util";


export default class CommentsTree extends Component {
    render() {
        return <div>
            <div className="commentTitle">コメント</div>
            <div>
                {this.props.comments.map(function (comment) {
                    return <div key={comment.id} className="comment">
                        <div>
                        <span className="commentAuthor">
                            {comment.author}
                        </span>
                            <span className="dateTime">
                            {formatDate(comment.timestamp)}
                        </span>
                        </div>
                        <div>{comment.text}</div>
                    </div>;
                })}
            </div>
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