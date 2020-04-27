import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity,SafeAreaView } from 'react-native';
import { withNavigationFocus } from '@react-navigation/compat';
import { CommonActions } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import {Icon, Input} from 'native-base';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import { connect } from 'react-redux';

//Redux
import {backImageAction} from '../redux/actions/Actions';

const {width,height} = Dimensions.get('window');

class Photo extends Component {

    constructor(props){
        super(props)

        this.state = {
            hasCameraPermission: false,
            backCamera : false,
            flash : false,
            loading: false,
            imageURL:null,
            imageBase64:null,
        }
    }

    async componentDidMount() {
        let permission = await Camera.requestPermissionsAsync() //Buscar funcion espanol
        this.setState({hasCameraPermission:permission})
    }

    takePicture = async function(camera) {
        //this.setState({loading:true});

        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);

        this.setState({
            imageBase64:data.base64,
            imageURL:`data:image/jpg;base64,${data.base64}`
        })
        this.setState({loading:true});
    };

    _backImage(){
        this.props.handleBackImage(this.state.imageBase64);
        this.props.navigation.dispatch(CommonActions.goBack())
    }

    render() {
        const { isFocused } = this.props
        const { hasCameraPermission } = this.state;
        if(hasCameraPermission === null ){
            return <View />
        } else if (hasCameraPermission === false) {
            return <Text>Debes conceder los permisos para acceder a la camara. </Text>
        } else if (isFocused){
            return (
                <View style={style.container}>
                    {!this.state.loading ? 
                        <Camera
                            ref={cam => {
                                this.camera = cam;
                            }}
                            style={style.preview}
                            type={ !this.state.backCamera ? Camera.Constants.Type.back : Camera.Constants.Type.front}
                            flashMode={this.state.flash ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
                        />
                        :
                        <View style={style.preview}>
                            {this.state.imageURL !== null &&
                                <Image 
                                    source={{ uri: this.state.imageURL }} 
                                    indicator={ProgressBar} 
                                    style={style.ImagePreview}
                                    indicatorProps={{
                                        borderColor:'#135B84',
                                        color:'#135B84'
                                    }}
                                />
                            }
                        </View>
                    }
                    {!this.state.loading ?
                        <View style={style.secButtonCamera}>
                            <TouchableOpacity style={style.FlashButton} onPress={() => this.setState({backCamera : !this.state.backCamera})}>
                                <Icon name="md-repeat" type="Ionicons" style={style.IconFlashButton} />
                            </TouchableOpacity>
                            <TouchableOpacity style={style.takePictureButton} onPress={this.takePicture.bind(this)}>
                                <Icon name="photo-camera" type="MaterialIcons" style={style.IconTakePictureButton} />
                            </TouchableOpacity>
                            <TouchableOpacity style={style.FlashButton} onPress={() => this.setState({flash : !this.state.flash})}>
                                {this.state.flash ? 
                                    <Icon name="md-flash" type="Ionicons" style={style.IconFlashButton} />
                                    :
                                    <Icon name="md-flash-off" type="Ionicons" style={style.IconFlashButton} />
                                }
                            </TouchableOpacity>
                        </View> 
                        :
                        <View style={style.secButtonCamera}>
                            <TouchableOpacity style={style.takePictureButton} onPress={() => this._backImage()}>
                                <Icon name="check" type="FontAwesome" style={style.IconTakePictureButton} />
                            </TouchableOpacity>
                            <View style={{marginHorizontal:'10%'}} />
                            <TouchableOpacity 
                                style={style.takePictureButton} 
                                onPress={() =>  this.setState({loading: false,imageURL:null})}
                            >
                                <Icon name="remove" type="FontAwesome" style={style.IconTakePictureButton} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            )
        } else {
            return <View />;
        }
    }
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    preview:{
        width,height:height-100
    },
    secButtonCamera:{
        width,
        height:100,
        backgroundColor:'#000000',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        position:'absolute',
        bottom:0
    },
    takePictureButton:{
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:3,
        borderColor:'#FFFFFF',
        justifyContent:'center',
        alignItems:'center'
    },
    IconTakePictureButton:{
        color:'#FFFFFF',
        fontSize:40
    },
    FlashButton:{
        width:50,
        height:50,
        borderRadius:25,
        borderWidth:3,
        borderColor:'#FFFFFF',
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal :30
    },
    IconFlashButton:{
        color:'#FFFFFF',
        fontSize:25
    },
    ImagePreview:{
        width,height:height-100,
    }
});

const mapStateToProps = (state) => ({
    
});

const mapDispatchToProps = dispatch => ({
    handleBackImage : (image)  => {
        dispatch(backImageAction(image))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(Photo))
