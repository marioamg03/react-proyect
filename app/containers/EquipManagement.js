import React, { Component } from 'react'
import { connect } from 'react-redux';
import { StackActions } from '@react-navigation/native';
import EquipManagementView from '../components/EquipManagementView';


//Redux
import {loadAction, lastEquipManagementAction, lastTypeManagementAction} from '../redux/actions/Actions';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            instalationName: this._updateTitle(props),
            list : props.listEquipManagement.filter(function(filterInst) {
                if (props.instalacion_id === null){
                    return filterInst.antes == null;
                } else {
                    return filterInst.antes == props.instalacion_id;
                }
            })
        }
    }

    _updateTitle = (props) => {
        return props.nextInstalation.name;
    }

    _updateEquip = (item) => {
        this.props.handleNextEquipManagement(item);
        this.props.handleLastTypeManagement(false);
        this.props.navigation.dispatch({
                ...StackActions.push('NewManagement'),
                source: 0,
        });
    }

    _updateInstalation = () => {
        this.props.handleNextEquipManagement(null);
        this.props.handleLastTypeManagement(true);
        this.props.navigation.dispatch({
                ...StackActions.push('NewManagement'),
                source: 0,
        });
    }

    render() {
        return <EquipManagementView
                    list={this.state.list}
                    instalationName = {this.state.instalationName}
                    updateEquip={(item) => this._updateEquip(item)}
                    updateInstalation={() => this._updateInstalation()}/>
    }
}

// Definimos las propiedades que obtenemos del redux store
const mapStateToProps = (state) => ({
    listEquipManagement: state.listAllEquipStore,
    nextInstalation: state.nextInstalationStore
})

// Definimos las funciones que obtenemos del redux saga
const mapDispatchToProps = dispatch => ({
    handleLoad: (bool) => {
        dispatch(loadAction(bool));
    },
    handleNextEquipManagement:data => {
        dispatch(lastEquipManagementAction(data));
    },
    handleLastTypeManagement:(bool) => {
        dispatch(lastTypeManagementAction(bool));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)