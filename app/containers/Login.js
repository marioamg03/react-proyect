import React, { Component } from 'react'
import LoginView from '../components/LoginView';

class Login extends Component {

    render() {
        return <LoginView
            user={this.state.user}
            password={this.state.password}
            changeTextUser={(user) => this.setState({user})}
            changeTextPassword={(password) => this.setState({password})}
            login={() => this._login()}
            load={this.props.load}
        />
    }
}

export default Login
