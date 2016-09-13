import React, {PropTypes, Component} from "react";

import {formatDate} from "../../util/util";


export default class Article extends Component {
    render() {
        const data = this.props.data;
        return <div>
            <div className="dateTime">
                {formatDate(data.timestamp)}
            </div>
            <div className="title">
                {data.title}
            </div>
            <div>
                {data.content}
            </div>
        </div>;
    }
}

Article.propTypes = {
    data: PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
    }).isRequired
};