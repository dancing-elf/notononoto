import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import {
    createLoadPostsDescFunction,
    createOpenPostFunction,
    createOpenNewPostPanelFunction
} from "../../actions/admin/adminActions";
import {getPostsDesc} from "../../reducers/admin/postsList";
import {getAuthState} from "../../reducers/admin/auth";

import {formatDate} from "../../util/util";


/** List of available posts */
class PostsList extends Component {
    componentDidMount() {
        this.props.loadPostsDesc(this.props.authToken);
    }
    openNewPostPanel() {
        this.props.openNewPostPanel();
    }
    render() {
        const self = this;
        return <div>
            <div>
                <input type="button"
                       value="New"
                       onClick={this.openNewPostPanel.bind(this)}/>
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
    open: PropTypes.func.isRequired,
    openNewPostPanel: PropTypes.func.isRequired
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
        open: createOpenPostFunction(dispatch),
        openNewPostPanel: createOpenNewPostPanelFunction(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostsList);