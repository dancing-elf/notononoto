import React, {PropTypes, Component} from "react";


/** On page load error */
export default class LoadError extends Component {
    render() {
        return <div>
            <div>Oops!</div>
            <div>{this.props.message}</div>
        </div>;
    }
}

LoadError.propTypes = {
    message: PropTypes.string,
};
