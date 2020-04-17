import React from 'react';
import { Text, SafeAreaView, StyleSheet, Dimensions,StatusBar,Platform, View} from 'react-native';
import { Button } from 'native-base';

const {width} = Dimensions.get('window');

const HomeView = props => {
    return (
        <SafeAreaView style={style.container}>
            {Platform.OS == 'ios' && 
                <StatusBar barStyle="dark-content" />
            }
            <View style={style.container}>
              <Text>Hello from home!</Text>

              <Button 
                style={style.buttonIngresar}
                title="Go To Profile"
                onPress={() => props.goHome()}
              />
           </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
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