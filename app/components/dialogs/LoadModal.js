import React from 'react';
import {ActivityIndicator,Modal,View,Dimensions,StyleSheet} from 'react-native';

let {width,height} = Dimensions.get('window');

const LoadModal = props => {
    return (
        <Modal visible={props.visible} transparent={true}>
            <View style={style.container} >
                <View style={style.ContentLoad}>
                    <ActivityIndicator size="large" color="#A9DFBF" />
                </View>
            </View>
        </Modal>
    )
};

const style = StyleSheet.create({
    container:{
        width,height,
        justifyContent:'center',
        alignItems:'center'
    },
    ContentLoad:{
        width:130,
        height:130,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)'
    }
})

export default LoadModal;