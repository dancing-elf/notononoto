import React, {PropTypes, Component} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

import {
    getPageState,
    OK_STATE,
    NOT_FOUND_STATE,
    LOAD_ERROR_STATE
} from "../../reducers/public/page";

import NotFoundError from "./NotFoundError";
import LoadError from "./LoadError";


/** Common layout of all pages */
export class CommonLayout extends Component {
    /**
     * Error handling
     * @returns {XML} return childrens in no errors happens or
     *                error page overwise
     */
    getContent() {
        switch (this.props.state) {
            case OK_STATE:
                return this.props.children;
            case NOT_FOUND_STATE:
                return <NotFoundError/>;
            case LOAD_ERROR_STATE:
                return <LoadError message={this.props.message}/>;
            default:
                throw Error("Unexpected state: " + this.props.state);
        }
    }
    render() {
        return <div id="common-layout-root">
            <div id="header">
                Notononoto blog
            </div>
            <div id="content">
                {this.getContent()}
            </div>
            <div id="footer">
                <div>
                    <Link to={"/about"}>ブログの概要</Link>
                </div>
            </div>
        </div>;
    }
}

CommonLayout.propTypes = {
    state: PropTypes.string.isRequired,
    message: PropTypes.string,
    children: PropTypes.node.isRequired
};

const mapStateToProps = (state) => {
    const pageState = getPageState(state);
    return {
        state: pageState.state,
        message: pageState.message
    };
};

export default connect(mapStateToProps)(CommonLayout);
