import React, {Component} from "react";


export default class CommentForm extends Component {
    render() {
        return <div>
            <div className="commentTitle">
                コメントを投稿
            </div>
            <div className="comment">
                <input/>
                <span>名前</span>
            </div>
            <div>
                <input/>
                <span>メール</span>
            </div>
            <div>
                <textarea/>
            </div>
            <div>
                <button>提出する</button>
            </div>
        </div>;
    }
}