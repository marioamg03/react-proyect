import React, { Component } from 'react'
import { connect } from 'react-redux';
import { StackActions, StackRouter } from '@react-navigation/native';
import HomeView from '../components/HomeView';

//Redux
import {loadAction, lastInstalationAction} from '../redux/actions/Actions';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            instalationName: this._updateTitle(props),
            viewButton: this._updateArea(props),
            showModalArea: false,
            list : props.listAllInstalations.filter(function(filterInst) {
                if (props.nextInstalation === null) {
                    return filterInst.antes == null;
                } else {
                    return filterInst.antes == props.nextInstalation.id;
                }
            })
        }
    }

    _updateArea = (props) => {
        if (props.nextInstalation === null){
            return true;
        } else {
            return false;
        }
    }

    _updateTitle = (props) => {
        if (props.nextInstalation === null){
            return 'Codelco';
        } else {
            return props.nextInstalation.name;
        }
    }


    _updateInstalation = (item) => {
        this.props.handleNextInstalation(item);

        if (item.final === 0) {
            this.props.navigation.dispatch({
                ...StackActions.push('Home'),
                source: 0,
            });
        } else {
            this.props.navigation.dispatch({
                ...StackActions.push('EquipManagement'),
                source: 0,
            });
        }
    }

    _showAreaModal = () => {
        this.setState({showModalArea:true});
    }

    _cancelModal = () => {
        this.setState({showModalArea:false});
    }

    render() {
        return <HomeView
                    load ={false}

                    areaView ={this.state.showModalArea}
                    areasList = {this.props.areasInfo}
                    updateArea={(item) => this._updateArea(item)}
                    showAreaModal = {this._showAreaModal}
                    cancelModal = {this._cancelModal}
 
                    viewButton = {this.state.viewButton}
                    list={this.state.list}
                    instalationName = {this.state.instalationName}
                    updateInstalation={(item) => this._updateInstalation(item)}/>
    }
}

// Definimos las propiedades que obtenemos del redux store
const mapStateToProps = (state) => ({
    listAllInstalations: state.listAllInstStore,
    nextInstalation: state.nextInstalationStore,
    areasInfo: state.listAllAreaStore
})

// Definimos las funciones que obtenemos del redux saga
const mapDispatchToProps = dispatch => ({
    handleLoad: (bool) => {
        dispatch(loadAction(bool));
    },
    handleNextInstalation:data => {
        dispatch(lastInstalationAction(data));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)