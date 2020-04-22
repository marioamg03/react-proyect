import React, { Component } from 'react'
import NewManagementView from '../components/NewManagementView';

import { connect } from 'react-redux';
import { StackActions } from '@react-navigation/native';

import {loadAction, lastInstalationAction} from '../redux/actions/Actions';

class NewManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            instalationName: this._updateTitle(props),
            chkbox_chk:false,
            title:null,
            observation:null
        }
    }

    _updateTitle = (props) => {
        if (props.nextInstalation === null){
            return 'Codelco';
        } else {
            return props.nextInstalation.name;
        }
    }

    _chkbox_check = () => {
        // var checked = this.state.chkbox_chk;
        // if(checked === false) {
        //     alert("d")
        //     this.setState({chkbox_chk:false})
        // } else {
        //     this.setState({chkbox_chk:true})
        // }

        this.setState({chkbox_chk:!this.state.chkbox_chk})




    } 


    render() {
        return <NewManagementView
                    title={this.state.title}
                    observation={this.state.observation}
                    changeTextTitle={(title) => this.setState({title})}
                    changeTextObservation={(observation) => this.setState({observation})}
                    
                    chkbox_chk={this.state.chkbox_chk}
                    chkbox_check={this._chkbox_check}
        />
    }
}

// Definimos las propiedades que obtenemos del redux store
const mapStateToProps = (state) => ({
    listAllInstalations: state.listAllInstStore,
    nextInstalation: state.nextInstalationStore
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
export default connect(mapStateToProps, mapDispatchToProps)(NewManagement)
