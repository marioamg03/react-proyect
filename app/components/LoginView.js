import React from 'react';
import { Text, SafeAreaView, StyleSheet, Image, Dimensions, KeyboardAvoidingView,StatusBar,Platform,TouchableOpacity} from 'react-native';
import { Form, Item, Input, Label,Button} from 'native-base';

// Componentes
//import LoadModal from '../components/Modals/LoadModal';

const {width} = Dimensions.get('window');

const LoginView = props => {
    return (
        <SafeAreaView style={style.container}>
            {Platform.OS == 'ios' && 
                <StatusBar barStyle="dark-content" />
            }
            <KeyboardAvoidingView keyboardVerticalOffset={ Platform.OS == 'android' && -500} behavior="padding" enabled>
                
            <Form style={style.containerForm}>
                <Item floatingLabel style={style.itemForm} >
                    <Label style={style.labelForm} >Usuario</Label>
                    <Input style={style.inputForm} onChangeText={(user) => props.changeTextUser(user)} value={props.user} />
                </Item>
                <Item floatingLabel style={style.itemForm}>
                    <Label style={style.labelForm}>Contraseña</Label>
                    <Input secureTextEntry={true} style={style.inputForm} onChangeText={(password) => props.changeTextPassword(password)} value={props.password} />
                </Item>
                <Button
                    style={style.buttonIngresar}
                    onPress={() => props.login()}
                >
                    <Text style={style.textButtonIngresar}>INGRESAR</Text>  
                </Button>
            </Form>
            </KeyboardAvoidingView>
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
        height:100,
        marginBottom:30
    },
    containerForm:{
        width:width*0.7
    },
    itemForm:{
        borderColor:'#2B6544',
        borderWidth:5,
    },
    labelForm:{
        color:'#2B6544',
        textAlign:'center',
        lineHeight:15
    },
    inputForm:{
        color:'#2B6544',
        textAlign:'center'
    },
    buttonIngresar:{
        backgroundColor:'#2B6544',
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
        color:'#2B6544',
        textAlign:'center'
    }
});

export default LoginView;