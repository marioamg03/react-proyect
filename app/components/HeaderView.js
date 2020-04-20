import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity,Dimensions} from 'react-native';
import {Icon} from 'native-base';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

//Redux
import {updateTurnPortageAction} from '../redux/actions/Actions';

const {width} = Dimensions.get('window');

const HeaderView = props => {
    return(
        <View style={[style.container,{position:'relative'}]}>
            {props.buttonHidden === undefined &&
                <View>
                {!props.goBack ?
                    <TouchableOpacity style={style.buttonMenu}/>
                :
                    <TouchableOpacity style={style.buttonMenu} onPress={() => props.goBack()} >
                        <Icon name="arrowleft" type="AntDesign" style={{color:'#FFFFFF'}} onPress={props.goBack} />
                    </TouchableOpacity>
                }
                </View>
            }
            <Text style={style.textTitle} >{props.title}</Text>

            {/* {!props.stateNetwork &&
                <Animatable.View animation="fadeInDown" style={{width,height:18,backgroundColor:'#E74C3C',position:'absolute',top:0}}>
                    <Text style={{color:'#FFFFFF',fontSize:12,fontWeight:'bold',textAlign:'center'}}>Sin Conexión</Text>
                </Animatable.View> 
            } */}
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        backgroundColor:'#135B84',
        height:70,
        width:'100%',
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    buttonMenu:{
        paddingHorizontal:5,
        justifyContent:'center',
    },
    textTitle:{
        fontSize:17,
        fontWeight:'bold',
        color:'#FFFFFF',
        marginLeft:25,
        marginTop: 15
    }
});

const mapStateToProps = (state) => ({
    stateNetwork:state.stateNetworkStore
});

const mapDispatchToProps = dispatch => ({
    handleUpdateTurnPortage : () => {
        dispatch(updateTurnPortageAction());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderView);