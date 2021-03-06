import React from 'react';
import { Text, SafeAreaView, StyleSheet, Dimensions,StatusBar,Platform,FlatList, View} from 'react-native';
import { Icon, Button } from 'native-base';

import HeaderView from '../components/HeaderView';
import EquipItemView from './EquipItemView';

const {width} = Dimensions.get('window');

const EquipManagementView = props => {
    return (<SafeAreaView style={style.container}>
        {/** Esto es para IOS **/}
        <View style={{backgroundColor:'#135B84',position:'absolute',width,height:60}} />
        
        <HeaderView title={props.instalationName} goBack={false}/>
              <FlatList
                data={props.list}
                renderItem={({ item }) =>  <EquipItemView item={item} updateEquip={() => props.updateEquip(item)}/>}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                ListFooterComponent={props.list.length > 0 ? <View style={{width,height:90}} /> : <Text style={style.messageCalendar}>{!props.load ? " No se encontró información para mostrar" : ""}</Text>}
                />
                <Button style={style.container_fab} onPress={() => props.updateInstalation()}>
                    < Icon name="add" type="MaterialIcons" style={style.icon}/> 
                </Button>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff'
    },
    icon:{
        fontSize:30,
        color:'#FFFFFF'
    },
    container_fab:{
        backgroundColor:'#135B84',
        width:70,
        height:70,
        justifyContent:'center',
        alignItems:'center',
        margin: 30,
        right: 10, 
        bottom: 10,
        borderRadius:100,
        position: 'absolute',  
        elevation: 8 
    },
    imagenBanner:{
        resizeMode:'contain',
        height:200,
        marginBottom:30
    },
    containerForm:{
        width:width*0.7
    },
    itemForm:{
        borderColor:'#135B84',
        borderWidth:5,
    },
    labelForm:{
        color:'#135B84',
        textAlign:'center',
        lineHeight:15
    },
    inputForm:{
        color:'#135B84',
        textAlign:'center'
    },
    buttonIngresar:{
        backgroundColor:'#135B84',
        marginTop:70,
        width:160,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    textButtonIngresar:{
        color:'#FFFFFF',
        fontWeight:'900'
    },
    buttonRegister:{
        fontSize:12,
        fontWeight:'900',
        color:'#135B84',
        textAlign:'center'
    }
});

export default EquipManagementView ;