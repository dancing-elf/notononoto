import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import {getLoginState} from "../../reducers/login";
import {
    createUpdateLoginFunction,
    createUpdatePasswordFunction,
    submitLogin
} from "../../actions/loginActions";


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
            <div id="loginInputs">
                <div>
                    <div className="label">Login</div>
                    <input type="text"
                           onChange={this.handleLoginChange.bind(this)}
                           value={this.props.loginValue}/>
                </div>
                <div>
                    <div className="label">Password</div>
                    <input type="password"
                           onChange={this.handlePasswordChange.bind(this)}
                           value={this.props.passwordValue}/>
                </div>
                <div>
                    <input type="submit" value="Enter"/>
                    <div className="error">
                        {this.props.isLoginOk ? "" : "Login or password is incorrect"}
                    </div>
                </div>
            </div>
        </form>;
    }
}

Login.propTypes = {
    updateLogin: PropTypes.func.isRequired,
    updatePassword: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,

    loginValue: PropTypes.string.isRequired,
    passwordValue: PropTypes.string.isRequired,
    isLoginOk: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    const loginState = getLoginState(state);
    return {
        loginValue: loginState.loginValue,
        passwordValue: loginState.passwordValue,
        isLoginOk: loginState.isLoginOk
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
