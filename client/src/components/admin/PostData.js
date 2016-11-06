import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import {
    getPostIdState,
    getPostState,
} from "../../reducers/admin/postData";

import {
    createUpdatePostHeaderFunction,
    createUpdatePostContentFunction,
    createSubmitPostDataAction,
    createUploadFilesAction,
    createLoadImagesNamesAction
} from "../../actions/admin/postDataActions";


/** Admin post edit form */
class PostData extends Component {
    componentDidMount() {
        this.props.loadImagesNames();
    }
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
    handleFile(e) {
        this.props.upload(e.target.files);
    }
    render() {
        let messageBox = null;
        if (this.props.postSaveSuccess) {
            messageBox = <div className="success">Success</div>;
        } else if (this.props.postSaveError) {
            messageBox = <div className="error">Can't save post data</div>;
        }
        return <div>
            <div className="boxTitle">Identifier</div>
            <div>{this.props.postId ? this.props.postId : "not created"}</div>
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
            <div className="boxTitle">Resources</div>
            <div>
                {this.props.images.map(function (image, idx) {
                    // it's bad idea to use index as key, but right
                    // now we haven't any other id
                    return <div key={idx}>{image}</div>;
                })}
            </div>
            <div>
                <input type="file" multiple onChange={this.handleFile.bind(this)}/>
                <div className="success">{this.props.successFiles}</div>
                <div className="error">{this.props.errorFiles}</div>
            </div>
        </div>;
    }
}

PostData.propTypes = {
    postId: PropTypes.number,
    post: PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        header: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
    }).isRequired,
    postSaveSuccess: PropTypes.bool.isRequired,
    postSaveError: PropTypes.bool.isRequired,
    submit: PropTypes.func.isRequired,
    updateHeader: PropTypes.func.isRequired,
    updateContent: PropTypes.func.isRequired,
    upload: PropTypes.func.isRequired,
    successFiles: PropTypes.string.isRequired,
    errorFiles: PropTypes.string.isRequired,
    images: PropTypes.array.isRequired,
    loadImagesNames: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        postId: getPostIdState(state),
        post: getPostState(state),
        postSaveSuccess: state.postData.postSaveSuccess,
        postSaveError: state.postData.postSaveError,
        successFiles: state.postData.successFiles,
        errorFiles: state.postData.errorFiles,
        images: state.postData.images
    };
}

function mapDispatchToProps(dispatch) {
    return {
        submit: () => dispatch(createSubmitPostDataAction()),
        updateHeader: createUpdatePostHeaderFunction(dispatch),
        updateContent: createUpdatePostContentFunction(dispatch),
        upload: (files) => dispatch(createUploadFilesAction(files)),
        loadImagesNames: () => dispatch(createLoadImagesNamesAction())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostData);
