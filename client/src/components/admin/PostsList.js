import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import {
    createLoadPostsDescFunction,
    createOpenPostFunction
} from "../../actions/admin/adminActions";
import {getPostsDesc} from "../../reducers/admin/postsList";
import {getAuthState} from "../../reducers/admin/auth";

import {formatDate} from "../../util/util";


/** List of available posts */
class PostsList extends Component {
    componentDidMount() {
        this.props.loadPostsDesc(this.props.authToken);
    }
    render() {
        const self = this;
        return <div>
            <div>
                <input type="button" value="New"/>
            </div>
            <div>
                {this.props.posts.map(function (post) {
                    return (
                        <div key={post.id}>
                            <a href="javascript:void(0);"
                               onClick={() => self.props.open(post.id, self.props.authToken)}>
                                {
                                    post.id + ". " +
                                    formatDate(post.timestamp) + " " +
                                    post.header
                                }
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>;
    }
}

PostsList.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        timestamp: PropTypes.string.isRequired,
        header: PropTypes.string.isRequired
    })).isRequired,
    authToken: PropTypes.shape({
        login: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired
    }).isRequired,
    loadPostsDesc: PropTypes.func.isRequired,
    open: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        posts: getPostsDesc(state),
        authToken: getAuthState(state)
    };
};

function mapDispatchToProps(dispatch) {
    return {
        loadPostsDesc: createLoadPostsDescFunction(dispatch),
        open: createOpenPostFunction(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostsList);