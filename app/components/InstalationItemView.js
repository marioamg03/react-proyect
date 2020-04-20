import React from 'react';
import {View,TouchableOpacity,Dimensions,Text,StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const InstalationItemView = props => {
    
    return (
        <TouchableOpacity 
            style={style.buttonView}
            onPress={() => props.item.antes !== undefined && props.updateInstalation(props.item)}
        >    
            <View style={style.secDrawable} >
                <Text style={style.nameInit} >{SubInitstring(props.item.name)}</Text>
            </View>

            <View style={style.secInfo} >
                    <Text style={style.name} >{props.item.name}</Text>
            </View>   
        </TouchableOpacity> 
    );
}

function SubInitstring(item) {

    var initials = { str: "", toString: function () { return this.str; } };
                {
                    var array13774 = item.split(" ");
                    var _loop_1 = function (index13773) {
                        var s = array13774[index13773];
                        {
                            /* append */ (function (sb) { sb.str = sb.str.concat(s.charAt(0)); return sb; })(initials);
                        }
                    };
                    for (var index13773 = 0; index13773 < array13774.length; index13773++) {
                        _loop_1(index13773);
                    }
                }
                if (initials.str.length > 1) {
                    return initials.str.substring(0, 2).toUpperCase();
                }
                else if (initials.str.length === 1) {
                    return initials.str.substring(0, 1).toUpperCase();
                }
}

const style = StyleSheet.create({
    buttonView:{
        width,
        height:80,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#000',
        flexDirection:'row',
        alignItems: 'center'
    },
    origin:{
        width:'15%',
        height:'100%',
    },
    secInfo:{
        width:'85%',
        height:'100%',
        paddingVertical:15,
        justifyContent: 'center',
        paddingLeft:10,
        paddingRight:10
    },
    secDrawable:{
        width: 70,
        height: 70,
        marginLeft:5,
        borderRadius: 100/2,
        backgroundColor: '#135B84',
        justifyContent:'center',
        alignItems: 'center'
    },
    secIconOrNum:{
        flexDirection:'row',
        height:35,
        width:'100%',
        justifyContent:'space-between'
    },
    name:{
        fontSize:17,
        fontWeight:'bold',
        color:'#135B84'
    },
    nameInit:{
        fontSize:25,
        fontWeight:'bold',
        color:'#FFFFFF'
    },
    ButtonLocation:{
        flexDirection:'row',
        position:'absolute',
        top:10,
        right:5
    },
    ButtonLocationDay:{
        top:80
    },
    imageButtonLocation:{
        height:35,
        width:35,
        resizeMode:'contain',
    },
    address:{
        color:'#135B84',fontSize:13
    },
    lastManagement:{
        color:'#A93226',fontSize:13,fontWeight:'900'
    },
    nextManagement:{
        color:'#2E86C1',fontSize:13,fontWeight:'bold'
    },
    numDay:{
        minWidth:30,
        height:30,
        borderRadius:15,
        backgroundColor:'#135B84',
        justifyContent:'center',
        alignItems:'center',
        marginRight:10,
        paddingHorizontal:5
    },
    numDayDanger:{
        backgroundColor:'red',
    }
})

export default InstalationItemView;