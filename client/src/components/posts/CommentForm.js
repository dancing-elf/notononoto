import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";

import {getPostId} from "../../reducers/post";
import {
    getInputState,
    submitCommentForm,
    updateAuthor,
    updateComment,
    updateEmail
} from "../../reducers/commentForm";


export class CommentForm extends Component {
    componentDidUpdate(prevProps) {

        const curProps = this.props;
        // Change focus when needed. If user click on another input
        // don't set focus from props
        if (curProps.authorHasFocus === prevProps.authorHasFocus &&
            curProps.emailHasFocus === prevProps.emailHasFocus &&
            curProps.commentHasFocus === prevProps.commentHasFocus) {
            return;
        }

        if (curProps.authorHasFocus) {
            this.refs.authorInput.focus();
        } else if (curProps.emailHasFocus) {
            this.refs.emailInput.focus();
        } else if (curProps.commentHasFocus) {
            this.refs.commentInput.focus();
        }
    }
    handleAuthorChange(e) {
        this.props.updateAuthor(e.target.value);
    }
    handleEmailChange(e) {
        this.props.updateEmail(e.target.value);
    }
    handleCommentChange(e) {
        this.props.updateComment(e.target.value);
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.submit();
    }
    render() {
        return <form noValidate onSubmit={this.handleSubmit.bind(this)}>
            <div className="commentTitle">
                コメントを投稿
            </div>
            <div>
                <input type="text"
                       className={this.props.authorHasError ? "error" : null}
                       placeholder="名前 (必須)"
                       ref="authorInput"
                       onChange={this.handleAuthorChange.bind(this)}
                       value={this.props.authorValue}/>
            </div>
            <div>
                <input type="email"
                       className={this.props.emailHasError ? "error" : null}
                       placeholder="メール (非公開) (必須)"
                       ref="emailInput"
                       onChange={this.handleEmailChange.bind(this)}
                       value={this.props.emailValue}/>
            </div>
            <div>
                <textarea id="commentInput"
                          className={this.props.commentHasError ? "error" : null}
                          placeholder="コメントを追加..."
                          ref="commentInput"
                          onChange={this.handleCommentChange.bind(this)}
                          value={this.props.commentValue}/>
            </div>
            <div>
                <input type="submit" value="コメントを送信"/>
            </div>
        </form>;
    }
}

CommentForm.propTypes = {
    postId: PropTypes.string.isRequired,

    submit: PropTypes.func.isRequired,
    updateAuthor: PropTypes.func.isRequired,
    updateEmail: PropTypes.func.isRequired,
    updateComment: PropTypes.func.isRequired,

    authorValue: PropTypes.string.isRequired,
    authorHasError: PropTypes.bool.isRequired,
    authorHasFocus: PropTypes.bool.isRequired,

    emailValue: PropTypes.string.isRequired,
    emailHasError: PropTypes.bool.isRequired,
    emailHasFocus: PropTypes.bool.isRequired,

    commentValue: PropTypes.string.isRequired,
    commentHasError: PropTypes.bool.isRequired,
    commentHasFocus: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
    return Object.assign({postId: getPostId(state)}, getInputState(state));
}

function mapDispatchToProps(dispatch) {
    return {
        submit: () => dispatch(submitCommentForm()),
        updateAuthor: updateAuthor(dispatch),
        updateEmail: updateEmail(dispatch),
        updateComment: updateComment(dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm);