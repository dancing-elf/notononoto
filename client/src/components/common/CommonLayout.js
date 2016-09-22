import React, {PropTypes, Component} from "react";
import {Link} from "react-router";


/** Common layout of all pages */
export default class CommonLayout extends Component {
    render() {
        return <div id="common-layout-root">
            <div id="header">
                Notononoto blog
            </div>
            <div id="content">
                {this.props.children}
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
    children: PropTypes.node.isRequired
};