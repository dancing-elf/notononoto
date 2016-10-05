import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import {getAuthState} from "../../reducers/admin/auth";
import {
    createUpdateLoginFunction,
    createUpdatePasswordFunction,
    submitLogin
} from "../../actions/admin/loginActions";


/** Login page for admin part of application */
class Login extends Component {
    handleLoginChange(e) {
        this.props.updateLogin(e.target.value);
    }
    handlePasswordChange(e) {
        this.props.updatePassword(e.target.value);
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.submit();
    }
    render() {
        return <form id="loginForm"
                     noValidate
                     onSubmit={this.handleSubmit.bind(this)}>
            <div>
                <div>Login</div>
                <input type="text"
                       onChange={this.handleLoginChange.bind(this)}
                       value={this.props.login}/>
            </div>
            <div>
                <div>Password</div>
                <input type="password"
                       onChange={this.handlePasswordChange.bind(this)}
                       value={this.props.password}/>
            </div>
            <div>
                <input type="submit" value="Sign In"/>
                <div className="error">
                    {this.props.hasError ? "Login or password is incorrect" : ""}
                </div>
            </div>
        </form>;
    }
}

Login.propTypes = {
    updateLogin: PropTypes.func.isRequired,
    updatePassword: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,

    login: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    hasError: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    const authState = getAuthState(state);
    return {
        login: authState.login,
        password: authState.password,
        hasError: authState.hasError
    };
};

function mapDispatchToProps(dispatch) {
    return {
        updateLogin: createUpdateLoginFunction(dispatch),
        updatePassword: createUpdatePasswordFunction(dispatch),
        submit: () => dispatch(submitLogin())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
