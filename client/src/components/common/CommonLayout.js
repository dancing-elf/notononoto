import React, {PropTypes, Component} from "react";


/** Common layout of all pages */
export default class CommonLayout extends Component {
    render() {
        return <div>
            <div className="header">
                <p>Notononoto blog</p>
            </div>
            <div className="content">
                {this.props.children}
            </div>
        </div>;
    }
}

CommonLayout.propTypes = {
    children: PropTypes.node.isRequired
};