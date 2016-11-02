import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";

import {getPostIdState} from "../../reducers/public/post";
import {
    AUTHOR_INPUT,
    EMAIL_INPUT,
    COMMENT_INPUT,
    USER_DEFINED,
    getCommentFormState,
} from "../../reducers/public/commentForm";
import {
    createSubmitCommentAction,
    createUpdateAuthorFunction,
    createUpdateCommentFunction,
    createUpdateEmailFunction,
    createResetFocusFunction
} from "../../actions/public/commentFormActions";


/** Form for user's comment input */
export class CommentForm extends Component {
    componentDidUpdate() {
        switch (this.props.focusInput) {
            case USER_DEFINED:
                // no action needed. Focus should be managed by user.
                // Not Redux.
                return;
            case AUTHOR_INPUT:
                this.refs.authorInput.focus();
                break;
            case EMAIL_INPUT:
                this.refs.emailInput.focus();
                break;
            case COMMENT_INPUT:
                this.refs.commentInput.focus();
                break;
            default:
                throw new Error(
                    "Unexpected focus element: " + this.props.focusInput);
        }
        // We don't want problem with events like "user click another input"
        // because it's hard to determine when we should invoke code above.
        // Simply reset focusInput property after we set focus.
        // Too complicated in any case but how we can do it with Redux better?
        this.props.resetAutoFocus();
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
                <span className="error">{this.props.isSendOk ? "" : "エラー"}</span>
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
    resetAutoFocus: PropTypes.func.isRequired,

    authorValue: PropTypes.string.isRequired,
    authorHasError: PropTypes.bool.isRequired,

    emailValue: PropTypes.string.isRequired,
    emailHasError: PropTypes.bool.isRequired,

    commentValue: PropTypes.string.isRequired,
    commentHasError: PropTypes.bool.isRequired,

    focusInput: PropTypes.string.isRequired,
    isSendOk: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
    return Object.assign(
        {postId: getPostIdState(state)}, getCommentFormState(state));
}

function mapDispatchToProps(dispatch) {
    return {
        submit: () => dispatch(createSubmitCommentAction()),
        updateAuthor: createUpdateAuthorFunction(dispatch),
        updateEmail: createUpdateEmailFunction(dispatch),
        updateComment: createUpdateCommentFunction(dispatch),
        resetAutoFocus: createResetFocusFunction(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm);