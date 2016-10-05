import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";

import {formatDate} from "../../util/util";
import {
    createAnswerFunction,
    createQuoteFunction
} from "../../actions/public/commentFormActions";


/** Post's comments */
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
                                <a href="javascript:void(0);"
                                   onClick={function () {
                                       self.props.answer(comment.author);
                                   }}>
                                    答え
                                </a>
                                <a href="javascript:void(0);"
                                   onClick={function () {
                                       self.props.quote(
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
    quote: PropTypes.func.isRequired,
    answer: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        quote: createQuoteFunction(dispatch),
        answer: createAnswerFunction(dispatch),
    };
}

export default connect(undefined, mapDispatchToProps)(CommentsTree);
