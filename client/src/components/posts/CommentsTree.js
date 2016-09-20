import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";

import {makeAnswer, makeQuote} from "../../reducers/commentForm";
import {formatDate} from "../../util/util";


class CommentsTree extends Component {
    render() {
        const self = this;
        return <div>
            <div className="commentTitle">コメント</div>
            <table><tbody>
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
                                <a href="#commentInput"
                                   onClick={function() {
                                       self.props.makeAnswer(comment.author);
                                   }}>
                                    答え
                                </a>
                                <a href="#commentInput"
                                   onClick={function() {
                                       self.props.makeQuote(
                                           comment.author, comment.text);
                                   }}>
                                    引用
                                </a>
                            </div>
                        </td>
                    </tr>;
                })}
            </tbody></table>
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
    })).isRequired,
    makeQuote: PropTypes.func.isRequired,
    makeAnswer: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        makeQuote: makeQuote(dispatch),
        makeAnswer: makeAnswer(dispatch),
    };
}

export default connect(undefined, mapDispatchToProps)(CommentsTree);
