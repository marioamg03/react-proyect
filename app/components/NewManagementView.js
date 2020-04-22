import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, Dimensions, KeyboardAvoidingView,StatusBar,Platform,TouchableOpacity} from 'react-native';
import { Form, Item, Input, Label, ListItem, Icon, Button, CheckBox} from 'native-base';

import HeaderView from '../components/HeaderView';

const {width} = Dimensions.get('window');

const NewManagementView = props => {
    return (<SafeAreaView style={style.container}>
        {/** Esto es para IOS **/}
        <View style={{backgroundColor:'#135B84',position:'absolute',width,height:60}} />
        <HeaderView title={"Nueva Mantencion Reactiva"} goBack={false}/>

        <Form style={style.containerForm}>
          <Item floatingLabel style={style.itemForm} >
              <Label style={style.labelForm} >Titulo</Label>
              <Input style={style.inputForm} onChangeText={(title) => props.changeTextTitle(title)} value={props.title} />
          </Item>
          <Item floatingLabel style={style.itemForm}>
              <Label style={style.labelForm}>Observacion</Label>
              <Input style={style.inputForm} multiline={true} onChangeText={(observation) => props.changeTextObservation(observation)} value={props.observation}/>
          </Item>

          <Item style={style.itemForm} onPress={props.chkbox_check()}>
            <CheckBox checked={props.chkbox_chk} />
            <Text style={style.textCheckBox}>Solicito informe de aprobación previo a que se ejecute el trabajo.</Text>
          </Item>

          <View style={style.buttonView}>
              <TouchableOpacity>
                <Icon name="add-a-photo" type="MaterialIcons" style={style.iconItemPhoto} />
              </TouchableOpacity>
            <Button style={style.buttonIngresar} onPress={() => props.login()}>
                  <Text style={style.textButtonIngresar}>ENVIAR</Text>  
            </Button>
          </View>
        </Form>
      </SafeAreaView>
    )
}

export default NewManagementView;

const style = StyleSheet.create({
  buttonView:{
    marginTop:25,
    backgroundColor:'#fff',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textCheckBox:{
    marginLeft:20
  },
  iconItemPhoto:{
    fontSize:55
  },
  iconItemPhotoActive:{
      fontSize:55,
      color:'#135B84'
  },
  container:{
      flex:1,
      backgroundColor:'#ffffff'
  },
  containerForm:{
      marginRight:20,
      marginTop:5
  },
  itemForm:{
    marginTop:25,
      borderColor:'#135B84',
      borderWidth:5,
  },
  labelForm:{
      color:'#135B84',
      textAlign:'left',
      lineHeight:15
  },
  inputForm:{
      color:'#135B84',
      textAlign:'left',
      maxHeight: 300
  },
  buttonIngresar:{
      backgroundColor:'#135B84',
      marginLeft:50,
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