import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";

import {
    getPostId,
    getInputState,
    submitCommentForm,
    updateAuthor,
    updateComment,
    updateEmail
} from "../../reducers/post";


export class CommentForm extends Component {
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
                       onChange={this.handleAuthorChange.bind(this)}
                       value={this.props.authorValue}/>
            </div>
            <div>
                <input type="email"
                       className={this.props.emailHasError ? "error" : null}
                       placeholder="メール (非公開) (必須)"
                       onChange={this.handleEmailChange.bind(this)}
                       value={this.props.emailValue}/>
            </div>
            <div>
                <textarea id="commentInput"
                          className={this.props.commentHasError ? "error" : null}
                          placeholder="コメントを追加..."
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
    emailValue: PropTypes.string.isRequired,
    emailHasError: PropTypes.bool.isRequired,
    commentValue: PropTypes.string.isRequired,
    commentHasError: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    const inputState = getInputState(state);
    return {
        postId: getPostId(state),
        authorValue: inputState.authorValue,
        authorHasError: inputState.authorHasError,
        emailValue: inputState.emailValue,
        emailHasError: inputState.emailHasError,
        commentValue: inputState.commentValue,
        commentHasError: inputState.commentHasError,
    };
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