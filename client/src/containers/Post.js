import React, {PropTypes, Component} from "react";


/** Post description */
export default class Post extends Component {
    render() {
        return <div>
            {this.props.params.postId}
        </div>;
    }
}

Post.propTypes = {
    params: PropTypes.shape({
        postId: PropTypes.string.isRequired,
    })
};