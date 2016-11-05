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
        let content;
        if (this.props.comments.length == 0) {
            content = <div>コメントがありません</div>;
        } else {
            content = <table><tbody>
                {this.props.comments.map(function (comment) {
                    return <tr key={comment.id} className="comment">
                        <td>{comment.number}.</td>
                        <td>
                            <div>{comment.text}</div>
                            <div className="commentBox">
                                <span>{comment.author}</span>
                                <span>{formatDate(comment.timestamp)}</span>
                            </div>
                            <div className="answerBox">
                                <a href="javascript:void(0);"
                                   onClick={function () {
                                       self.props.answer(comment.number);
                                   }}>
                                    答え
                                </a>
                                <a href="javascript:void(0);"
                                   onClick={function () {
                                       self.props.quote(comment);
                                   }}>
                                    引用
                                </a>
                            </div>
                        </td>
                    </tr>;
                })}
                </tbody></table>;
        }
        return <div>
            <div className="commentTitle">コメント</div>
            {content}
        </div>;
    }
}

CommentsTree.propTypes = {
    comments: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        postId: PropTypes.number.isRequired,
        number: PropTypes.number.isRequired,
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
