import React, { Component } from 'react'
import { connect } from 'react-redux';
import { StackActions } from '@react-navigation/native';
import HomeView from '../components/HomeView';

//Redux
import {loadAction} from '../redux/actions/Actions';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            list : props.listAllInstalations,
        }

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

// Definimos las propiedades que obtenemos del redux store
const mapStateToProps = (state) => ({
    listAllInstalations: state.listAllInstStore,
})

// Definimos las funciones que obtenemos del redux saga
const mapDispatchToProps = dispatch => ({
    handleLoad: (bool) => {
        dispatch(loadAction(bool));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
