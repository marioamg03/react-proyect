import React, { Component } from 'react';
import {Toast} from 'native-base';
import NewManagementView from '../components/NewManagementView';
import { CommonActions } from '@react-navigation/native';

import { connect } from 'react-redux';
import { StackActions } from '@react-navigation/native';

import {sendDataAction, loadAction, backImageAction, lastInstalationAction, lastTypeManagementAction} from '../redux/actions/Actions';

class NewManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            area_item_id:props.nextInstalation.id,
            equip_item_id: this._updateEquipId(props),
            date_gestion:null,
            estado: null,
            photo1:null,
            instalationName: this._updateTitle(props),
            chkbox_chk1:false,
            chkbox_chk2:false,
            title:null,
            observation:null,
            lastType:props.lastType
        }
        this.numPhoto;

        console.log(this.state)
    }

    componentWillUpdate(nextProps, nextState){
        if(this.props.backImage !== nextProps.backImage && nextProps.backImage !== null){
            if(this.numPhoto == 1)
                this.setState({photo1:nextProps.backImage});

            this.props.handleBackImage(null);
        }
    }

    _updateEquipId = (props) => {
        if (props.lastEquip === null) {
            return null;
        } else {
            return props.lastEquip.id;
        }
    }

    _updateTitle = (props) => {
        if (props.nextInstalation === null) {
            return 'Codelco';
        } else {
            return props.nextInstalation.name;
        }
    }

    _chkbox_check1 = () => {
        this.setState({chkbox_chk1:true})
        this.setState({chkbox_chk2:false})
        this.setState({estado:'por autorizar'})
    }

    _chkbox_check2 = () => {
        this.setState({chkbox_chk1:false})
        this.setState({chkbox_chk2:true})
        this.setState({estado:'no hecho'})
    }

    _goSetPhoto(numPhoto){
        this.numPhoto = numPhoto;
        this.props.navigation.navigate('Photo');
    }

    _sendData() {

        if(this.state.title !== null && this.state.title !== '' && this.state.observation !== null && this.state.observation !== '' 
            && this.state.estado !== null && this.state.photo1 !== null ) {
            
            let area_item_id,type;

            if(this.state.lastType) {
                area_item_id = this.state.area_item_id;
                type = 1;
            } else {
                area_item_id = this.state.equip_item_id;
                type = 2;
            }

            this.props.handleSendData({
                area_item_id:area_item_id,
                es_instalacion:type,
                titulo:this.state.title,
                observacion:this.state.observation,
                date_gestion:'',
                estado:this.state.estado,
                imagen:this.state.photo1
            })

            this.props.navigation.dispatch(CommonActions.goBack())

        } else {
            Toast.show({
                text: "Debes introducir todos los campos.",
                duration: 3000,
                type: "warning",
                buttonText: "Aceptar",
            });
        }
        
    }

    render() {
        return <NewManagementView
                    title={this.state.title}
                    observation={this.state.observation}
                    changeTextTitle={(title) => this.setState({title})}
                    changeTextObservation={(observation) => this.setState({observation})}
                
                    chkbox_chk1={this.state.chkbox_chk1}
                    chkbox_check1={this._chkbox_check1}

                    chkbox_chk2={this.state.chkbox_chk2}
                    chkbox_check2={this._chkbox_check2}

                    photo1={this.state.photo1}
                    goSetPhoto={(num) => this._goSetPhoto(num)}

                    sendData={() => this._sendData()}
        />
    }
}

// Definimos las propiedades que obtenemos del redux store
const mapStateToProps = (state) => ({
    listAllInstalations: state.listAllInstStore,
    nextInstalation: state.nextInstalationStore,
    backImage : state.backImageStore,
    lastType: state.lastTypeManagement,
    lastEquip: state.lastEquipManagement
})

// Definimos las funciones que obtenemos del redux saga
const mapDispatchToProps = dispatch => ({
    handleSendData: (data) => {
        dispatch(sendDataAction(data));
    },
    handleLoad: (bool) => {
        dispatch(loadAction(bool));
    },
    handleNextInstalation:data => {
        dispatch(lastInstalationAction(data));
    },
    handleLastTypeManagement:(bool) => {
        dispatch(lastTypeManagementAction(bool));
    },
    handleBackImage : (image)  => {
        dispatch(backImageAction(image))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(NewManagement)
