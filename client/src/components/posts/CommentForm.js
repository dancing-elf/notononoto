import React, {PropTypes, Component} from "react";


export default class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleAuthorChange(e) {
        const input = e.target.value;
        if (input.trim().length < 50) {
            this.setState({author: input});
        }
    }
    handleEmailChange(e) {
        const input = e.target.value;
        if (input.trim().length < 50) {
            this.setState({email: input});
        }
    }
    handleTextChange(e) {
        const input = e.target.value;
        if (input.trim().length < 10000) {
            this.setState({text: input});
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        const author = this.state.author.trim();
        const email = this.state.email.trim();
        const text = this.state.text.trim();

        let authorHasError = false;
        let emailHasError = false;
        let textHasError = false;

        if (!text) {
            textHasError = true;
        }
        // not perfect but relatively simple.
        // html5 validation in react with firefox highlight input as error
        // before submission. Complex regexp should be implemented on server
        // side too. In any case this email is not very important
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailHasError = true;
        }
        if (!author) {
            authorHasError = true;
        }
        if (!authorHasError && !emailHasError && !textHasError) {
            this.props.onCommentSubmit({
                author: author,
                email: email,
                text: text
            });
            this.setState(INITIAL_STATE);
        } else {
            this.setState({
                authorHasError: authorHasError,
                emailHasError: emailHasError,
                textHasError: textHasError
            });
        }
    }
    render() {
        return <form noValidate onSubmit={this.handleSubmit}>
            <div className="commentTitle">
                コメントを投稿
            </div>
            <div className="comment">
                <input type="text"
                       className={this.state.authorHasError ? "error" : null}
                       placeholder="名前 (必須)"
                       onChange={this.handleAuthorChange}
                       value={this.state.author}/>
            </div>
            <div>
                <input type="email"
                       className={this.state.emailHasError ? "error" : null}
                       placeholder="メール (非公開) (必須)"
                       onChange={this.handleEmailChange}
                       value={this.state.email}/>
            </div>
            <div>
                <textarea className={this.state.textHasError ? "error" : null}
                          placeholder="コメントを追加..."
                          onChange={this.handleTextChange}
                          value={this.state.text}/>
            </div>
            <div>
                <input type="submit" value="コメントを送信"/>
            </div>
        </form>;
    }
}

CommentForm.propTypes = {
    onCommentSubmit: PropTypes.func.isRequired,
};

const INITIAL_STATE = {
    author: "",
    authorHasError: false,
    email: "",
    emailHasError: false,
    text: "",
    textHasError: false
};
