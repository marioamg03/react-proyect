import React from 'react';
import { Text, SafeAreaView, StyleSheet, Dimensions,StatusBar,Platform,FlatList, View} from 'react-native';

import HeaderView from '../components/HeaderView';
import InstalationItemView from './InstalationItemView';

const {width} = Dimensions.get('window');

const HomeView = props => {
    return (<SafeAreaView style={style.container}>
        {/** Esto es para IOS **/}
        <View style={{backgroundColor:'#135B84',position:'absolute',width,height:60}} />
        
        <HeaderView title={props.instalationName} goBack={false}/>
              <FlatList
                data={props.list}
                renderItem={({ item }) =>  <InstalationItemView item={item} updateInstalation={() => props.updateInstalation(item)}/>}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                ListFooterComponent={props.list.length > 0 ? <View style={{width,height:90}} /> : <Text style={style.messageCalendar}>{!props.load ? " No se encontró información para mostrar" : ""}</Text>}
                /> 
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff'
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

export default HomeView;