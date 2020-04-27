import React from 'react';
import {ActivityIndicator,TouchableOpacity,Modal,View,Dimensions,StyleSheet} from 'react-native';
import { Icon, Button,Text } from 'native-base';

let {width,height} = Dimensions.get('window');

const LoadModal = props => {
    return (
        <Modal visible={props.visible} transparent={true}>
            <View style={style.container} >
                <View style={style.ContentLoad}>
                    <Text style={style.text_container}>Seleccione el area a la cual desea cambiar.</Text>
                    <View style={style.head}>
                    </View>
                    <View style={style.buttons_row}>

                        <TouchableOpacity onPress={props.cancelModal}>
                            <Text style={style.text_container}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text style={style.text_container}>Aceptar</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    )
};

const style = StyleSheet.create({
    container:{
        width,height,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    buttons_row:{
        width:width*0.7,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    text_container: {
        padding:20,
        fontWeight:'bold',
        textAlign: 'center',
        fontSize: 18,
        color:'#ffffff'
    },
    head: {
        width:width*0.7,
        height:height*0.2,
        backgroundColor: '#ffffff'
    },
    ContentLoad:{
        width:width*0.7,
        height:height*0.4,
        backgroundColor:'#135B84'
    }
})

export default LoadModal;