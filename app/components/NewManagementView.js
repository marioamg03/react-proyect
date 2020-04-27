import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, Dimensions, KeyboardAvoidingView,StatusBar,Platform,TouchableOpacity} from 'react-native';
import { Form, Item, Input, Label, ListItem, Icon, Button, Radio, CheckBox} from 'native-base';

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

          <Text style={style.textCheckBox}>Solicito informe de aprobación previo a que se ejecute el trabajo.</Text>
          
          <Item style={style.radioGroup}>
            <View style={{marginTop:10, justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
              <Radio selected={props.chkbox_chk1} onPress={props.chkbox_check1} />
              <Text style={style.textCheckBox} style={{margin:0, marginLeft:20}} >Si</Text>
            </View>

            <View style={{marginTop:10, justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
              <Radio style={style.radio} selected={props.chkbox_chk2} onPress={props.chkbox_check2}/>
              <Text style={style.textCheckBox} style={{margin:0, marginLeft:20}}>No</Text>
            </View>
          </Item>

          <View style={style.buttonView}>
            <TouchableOpacity style={style.itemPhoto} onPress={() => props.goSetPhoto(1)} >
                {props.photo1 === null ? 
                    <Icon name="add-a-photo" type="MaterialIcons" style={style.iconItemPhoto} />
                    :
                    <View style={style.setActivoItemPhoto}>
                        <Icon name="photo-camera" type="MaterialIcons" style={style.iconItemPhotoActive} />
                        <Text style={style.textPhotoActive}>Foto Almacenada</Text>
                    </View>
                }
            </TouchableOpacity>
            <Button style={style.buttonIngresar} onPress={() => props.sendData()}>
                  <Text style={style.textButtonIngresar}>ENVIAR</Text>  
            </Button>
          </View>
        </Form>
      </SafeAreaView>
    )
}

export default NewManagementView;

const style = StyleSheet.create({
  buttonView: {
    marginTop:50,
    backgroundColor:'#fff',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioGroup:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  radio:{
    marginLeft: 30
  },
  itemPhoto:{
    width:'40%',
    height:120,
    justifyContent:'center',
    alignItems:'center',
    position:'relative',
    borderWidth:1,
    borderRadius:10,
    shadowColor: "#000",
    backgroundColor:'#FFF',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
  setActivoItemPhoto:{
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    overflow:'hidden',
    borderRadius:10  
  },
  textPhotoActive:{
    width:'100%',
    backgroundColor:'#135B84',
    color:'#FFFFFF',
    position:'absolute',
    bottom:0,
    left:0,
    textAlign:'center',
    fontSize:12,
  },
  textCheckBox:{
    marginTop:25,
    marginLeft:20,
    marginRight: 20
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
      borderRadius:100,
      padding:20,
      marginLeft:20,
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
  buttonRegister:{
      fontSize:12,
      fontWeight:'900',
      color:'#135B84',
      textAlign:'center'
  }
});