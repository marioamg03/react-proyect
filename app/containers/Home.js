import React, { Component } from 'react'
import { connect } from 'react-redux';
import { StackActions } from '@react-navigation/native';
import HomeView from '../components/HomeView';

class Home extends Component {

    constructor(props) {
        super(props);
    }

    goHome() {
        this.props.navigation.dispatch({
            ...StackActions.push('Home'),

            

            source: 0,
        });
    }

    render() {
        return <HomeView
                    goHome={() => this.goHome()}/>
    }
}

export default Home
