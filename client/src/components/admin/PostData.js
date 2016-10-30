import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import {
    getPostIdState,
    getPostState,
} from "../../reducers/admin/postData";

import {
    createUpdatePostHeaderFunction,
    createUpdatePostContentFunction,
    createSubmitPostDataAction
} from "../../actions/admin/postDataActions";


/** Admin post edit form */
class PostData extends Component {
    handleHeaderChange(e) {
        this.props.updateHeader(e.target.value);
    }
    handleContentChange(e) {
        this.props.updateContent(e.target.value);
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.submit();
    }
    render() {
        let messageBox = null;
        if (this.props.postSaveSuccess) {
            messageBox = <div className="success">Success</div>;
        } else if (this.props.postSaveError) {
            messageBox = <div className="error">Can't save post data</div>;
        }
        return <div>
            <form noValidate onSubmit={this.handleSubmit.bind(this)}>
                <div className="boxTitle">Header</div>
                <input type="text"
                       onChange={this.handleHeaderChange.bind(this)}
                       value={this.props.post.header}/>
                <div className="boxTitle">Content</div>
                <textarea onChange={this.handleContentChange.bind(this)}
                          value={this.props.post.content}/>
                <input type="submit" value="Save"/>
                {messageBox}
            </form>
        </div>;
    }
}

PostData.propTypes = {
    post: PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        header: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
    }).isRequired,
    postSaveSuccess: PropTypes.bool.isRequired,
    postSaveError: PropTypes.bool.isRequired,
    submit: PropTypes.func.isRequired,
    updateHeader: PropTypes.func.isRequired,
    updateContent: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        postId: getPostIdState(state),
        post: getPostState(state),
        postSaveSuccess: state.postData.postSaveSuccess,
        postSaveError: state.postData.postSaveError
    };
}

function mapDispatchToProps(dispatch) {
    return {
        submit: () => dispatch(createSubmitPostDataAction()),
        updateHeader: createUpdatePostHeaderFunction(dispatch),
        updateContent: createUpdatePostContentFunction(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostData);
