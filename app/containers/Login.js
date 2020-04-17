import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StackActions } from '@react-navigation/native';
import LoginView from '../components/LoginView';

//Redux
import {loginAction, loadAction, pushAction} from '../redux/actions/Actions';

class Login extends Component {

    constructor(props){
        super(props);
        this.state={
            user:null,
            password:null,

        }
    }

    _login() {
        //this.props.navigation.navigate('Home');
        if(this.state.user !== null && this.state.password !== null && this.state.user !== '' && this.state.password !== 'null' ){
            this.props.handleLoad(true);
            this.props.handleLogin({
                rut:this.state.user,
                password:this.state.password
            })
        }
    }

    componentWillUpdate(nextProps, nextState){

        if(this.props.push != nextProps.push && nextProps.push){
            this.props.handlePush(false);
            setTimeout(async () => {
                this.props.navigation.dispatch({
                    ...StackActions.replace('Home'),
                    source: 0,
                });
                this.props.handleLoad(false);

            },500)
        }
    }

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

const mapDispatchToProps = dispatch => ({
    handleLogin: (data) => {
        dispatch(loginAction(data));
    },
    handleLoad: (bool) => {
        dispatch(loadAction(bool));
    },
    handlePush: (bool) => {
        dispatch(pushAction(bool))
    }
});

const mapStateToProps = (state) => ({
    load : state.loadStore,
    push : state.pushStore
});

export default connect(mapStateToProps,mapDispatchToProps)(Login)
