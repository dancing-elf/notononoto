import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import PostsList from "./PostsList";
import PostData from "./PostData";

import {POSTS_LIST, POST_DATA, getAdminState} from "../../reducers/admin/admin";


/** Admin control panel */
class ControlPanel extends Component {
    render() {
        switch (this.props.state) {
            case POSTS_LIST:
                return <PostsList/>;
            case POST_DATA:
                return <PostData/>;
            default:
                throw Error("Unexpected admin page state: " + this.props.state);
        }
    }
}

ControlPanel.propTypes = {
    state: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
    const adminState = getAdminState(state);
    return {
        state: adminState.state
    };
};

export default connect(mapStateToProps)(ControlPanel);