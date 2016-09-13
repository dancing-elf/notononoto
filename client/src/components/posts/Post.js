import React, {PropTypes, Component} from "react";
import axios from "axios";

import Article from "./Article";
import CommentsTree from "./CommentsTree";
import CommentForm from "./CommentForm";

/** Post description */
export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {data: undefined};
    }
    componentDidMount() {
        const self = this;
        axios.get("/api/post/" + this.props.params.postId)
            .then(function (response) {
                self.setState({data: response.data});
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    render() {
        const state = this.state.data;
        if (!state) {
            return <div></div>;
        }
        return <div>
            <Article data={state.post}/>
            <CommentsTree comments={state.comments}/>
            <CommentForm/>
        </div>;
    }
}

Post.propTypes = {
    params: PropTypes.shape({
        postId: PropTypes.string.isRequired
    })
};
