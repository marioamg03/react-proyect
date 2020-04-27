import React from 'react';
import { Text, SafeAreaView, StyleSheet, Image, Dimensions, KeyboardAvoidingView,StatusBar,Platform,TouchableOpacity} from 'react-native';
import { Form, Item, Input, Label,Button} from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

// Componentes
import LoadModal from '../components/dialogs/LoadModal';

const {height,width} = Dimensions.get('window');

const LoginView = props => {
    return (
        <SafeAreaView style={style.container}>
            {Platform.OS == 'ios' && 
                <StatusBar barStyle="dark-content" />
            }
            <LoadModal visible={props.load} />
            <LinearGradient
                style={style.containerGradient}
                colors={['rgb(19,91,132)', 'rgb(4,117,188)']}>

            <Image style={style.imagenBanner} source={require('../assets/img/logo_sgmi_para_app.png')} />
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

                <Text style={style.textVersion}>V 1.0</Text>
            </Form>
            </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerGradient:{
        width:width,
        height:height,
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
    },
    imagenBanner:{
        resizeMode:'contain',
        height:200,
        marginBottom:30
    },
    containerForm:{
        width:width*0.8,
        padding:35,
        borderRadius:30,
        backgroundColor:'#FFFFFF'
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
        borderRadius:100,
        padding:20,
        backgroundColor:'#135B84',
        marginTop:70,
        width:180,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    textButtonIngresar:{
        color:'#FFFFFF',
        fontWeight:'bold'
    },
    textVersion:{
        marginTop:15,
        color:'#135B84',
        fontWeight:'bold',
        textAlign:'center'
    }
});

export default LoginView;