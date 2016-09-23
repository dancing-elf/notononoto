import React, {PropTypes, Component} from "react";

import {formatDate} from "../../util/util";


/** Main article with it's properties */
export default class Article extends Component {
    render() {
        const post = this.props.post;
        return <div>
            <div className="dateTime">
                {formatDate(post.timestamp)}
            </div>
            <div className="title">
                {post.header}
            </div>
            <div>
                {post.content}
            </div>
        </div>;
    }
}

Article.propTypes = {
    post: PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        header: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
    }).isRequired
};