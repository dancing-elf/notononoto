import React, {PropTypes, Component} from "react";

export default class MainLayout extends Component {
    render() {
        return <div>
            <div className="header">
                <p>Notononto blog</p>
            </div>
            <div className="content">
                {this.props.children}
            </div>
        </div>;
    }
}

MainLayout.propTypes = {
    children: PropTypes.node.isRequired
};