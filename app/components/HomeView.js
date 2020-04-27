import React from 'react';
import { Text, SafeAreaView, StyleSheet, Dimensions,StatusBar,Platform,FlatList, View} from 'react-native';

import HeaderView from '../components/HeaderView';
import InstalationItemView from './InstalationItemView';
import { Icon, Button } from 'native-base';

// Componentes
import AreaChangeModal from '../components/dialogs/AreaChangeModal';
import LoadModal from '../components/dialogs/LoadModal';

const {width} = Dimensions.get('window');

const HomeView = props => {
    return (<SafeAreaView style={style.container}>
        {/** Esto es para IOS **/}
        <LoadModal visible={props.load} />
        <AreaChangeModal visible={props.areaView} cancelModal={props.cancelModal}/>

        <View style={{backgroundColor:'#135B84',position:'absolute',width,height:60}} />
        
        <HeaderView title={props.instalationName} goBack={false}/>
              <FlatList
                data={props.list}
                renderItem={({ item }) =>  <InstalationItemView item={item} updateInstalation={() => props.updateInstalation(item)}/>}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                ListFooterComponent={props.list.length > 0 ? <View style={{width,height:90}} /> : <Text style={style.messageCalendar}>{!props.load ? "No hay equipos asignados a esta instalacion." : ""}</Text>}
                />

                {!props.viewButton ?
                    <View/>
                :
                <Button style={style.container_fab} onPress={props.showAreaModal}>
                    < Icon name="menu" type="MaterialIcons" style={style.icon}/> 
                </Button>
                }


        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    icon:{
        fontSize:30,
        color:'#FFFFFF'
    },
    container:{
        flex:1,
        backgroundColor:'#ffffff'
    },
    container_fab:{
        backgroundColor:'#135B84',
        width:70,
        height:70,
        justifyContent:'center',
        alignItems:'center',
        margin: 30,
        borderRadius:100,
        left: 10, 
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
    },
    messageCalendar:{
        fontSize:20,
        color:'#135B84',
        marginTop:10,
        fontWeight:'900',
        marginHorizontal:5,
        textAlign:'center'
    }
});

export default HomeView;