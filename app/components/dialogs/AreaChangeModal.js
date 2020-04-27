import React from 'react';
import {ActivityIndicator,TouchableOpacity,Modal,View,Dimensions,StyleSheet,FlatList} from 'react-native';
import { Icon, Button,Text } from 'native-base';

let {width,height} = Dimensions.get('window');

function Item({ item }) {
    return (
    <TouchableOpacity 
            style={style.buttonView}
             onPress={() => props.updateArea(item)}
        > 
        <Text style={style.name}>{item.nombre}</Text>
    </TouchableOpacity>
    );
  }

const LoadModal = props => {

    console.log(props.areasList)
    return (
        <Modal visible={props.visible} transparent={true}>
            <View style={style.container} >
                <View style={style.ContentLoad}>
                    <Text style={style.text_container}>Seleccione el area a la cual desea cambiar.</Text>
                    <View style={style.head}>
                    <FlatList
                        data={props.areasList}
                        renderItem={({ item }) => <Item item={item} />}
                        keyExtractor={item => item.id}
                    />
                    </View>
                    <View style={style.buttons_row}>

                        <TouchableOpacity onPress={props.cancelModal}>
                            <Text style={style.text_container}>Cancelar</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    )
};

const style = StyleSheet.create({
    name:{
        fontSize:18,
        fontWeight:'bold',
        color:'#135B84'
    },
    buttonView:{
        height:40,
        backgroundColor:'#fff',
        borderBottomWidth:0.6,
        borderColor:'#000',
        alignItems:'center',
    },
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