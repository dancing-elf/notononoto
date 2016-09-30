import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";

import {
    getPageState,
    OK_STATE,
    NOT_FOUND_STATE,
    LOAD_ERROR_STATE
} from "../../reducers/page";
import {getAuthState} from "../../reducers/auth";

import NotFoundError from "../errors/NotFoundError";
import LoadError from "../errors/LoadError";

import Login from "./Login";
import ControlPanel from "./ControlPanel";


/** Common layout of all pages */
export class Admin extends Component {
    /**
     * Error handling
     * @returns {XML} return childrens in no errors happens or
     *                error page overwise
     */
    getContent() {
        switch (this.props.state) {
            case OK_STATE: {
                if (!this.props.isLogged) {
                    return <Login/>;
                } else {
                    return <ControlPanel/>;
                }
            }
            case NOT_FOUND_STATE:
                return <NotFoundError/>;
            case LOAD_ERROR_STATE:
                return <LoadError message={this.props.message}/>;
            default:
                throw Error("Unexpected state: " + this.props.state);
        }
    }
    render() {
        return <div className="admin" id="common-layout-root">
            <div id="header">
                Notononoto admin panel
            </div>
            <div id="content">
                {this.getContent()}
            </div>
        </div>;
    }
}

Admin.propTypes = {
    state: PropTypes.string.isRequired,
    message: PropTypes.string,
    isLogged: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    const pageState = getPageState(state);
    const authState = getAuthState(state);
    return {
        state: pageState.state,
        message: pageState.message,
        isLogged: authState.isLogged
    };
};

export default connect(mapStateToProps)(Admin);
