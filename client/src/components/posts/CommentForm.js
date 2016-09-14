import React, {PropTypes, Component} from "react";


export default class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {author: "", email: "", text: ""};
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleAuthorChange(e) {
        this.setState({author: e.target.value});
    }
    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }
    handleTextChange(e) {
        this.setState({text: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        const author = this.state.author.trim();
        const email = this.state.email.trim();
        const text = this.state.text.trim();
        if (!text || !author || !email) {
            return;
        }
        this.props.onCommentSubmit({
            author: author,
            email: email,
            text: text
        });
        this.setState({author: "", email: "", text: ""});
    }
    render() {
        return <form onSubmit={this.handleSubmit}>
            <div className="commentTitle">
                コメントを投稿
            </div>
            <div className="comment">
                <input type="text" onChange={this.handleAuthorChange}/>
                <span>名前</span>
            </div>
            <div>
                <input type="text" onChange={this.handleEmailChange}/>
                <span>メール</span>
            </div>
            <div>
                <textarea onChange={this.handleTextChange}/>
            </div>
            <div>
                <input type="submit" value="提出する"/>
            </div>
        </form>;
    }
}

CommentForm.propTypes = {
    onCommentSubmit: PropTypes.func.isRequired,
};