import {takeEvery, call, select, put} from 'redux-saga/effects';
import {Platform,AsyncStorage} from 'react-native';
import {Toast} from 'native-base';
import moment from 'moment';
import NetInfo from "@react-native-community/netinfo";

//constants
import apiConstants from '../../constants/api';
import sagasConstants from '../../constants/sagas';

//Redux
import {
    loadAction,
    pushAction,
    areasInfoAction,
    instInfoAction,
    equipInfoAction,
    lastInstalationAction
} 
from '../actions/Actions';

const SAVE_INDEX = {
    LIST_AREAS:{name: 'LIST_AREAS', action:areasInfoAction},
    LIST_INSTALACIONES:{name:'LIST_INSTALACIONES',action:instInfoAction},
    LIST_EQUIPOS:{name:'LIST_EQUIPOS',action:equipInfoAction}
}

const request = async (url,body,method,headers) => {
    return new Promise( async (resolve,refect) => {

        let timer = setTimeout(() => {
            resolve();
        },10000)

        let request = await fetch(url,{
            headers,
            body: body !== null ? JSON.stringify(body) : null,
            method,
        });

        switch(request.status){
            case 500:
                refect();
                break;
            default:
                let response = await request.json();
                resolve({status:request.status, body:response});
                break;
        }
    });

} 

const getToken = async () => {
    let token = await AsyncStorage.getItem('token');
    let tokenType = await AsyncStorage.getItem('token_type');
    return `${tokenType} ${token}`;
}

const getNetInfo = async () => {
    let promiseAux = new Promise((resolve,reject) => {
        if(Platform.OS == 'android')
            NetInfo.fetch().then(state => resolve(state.isInternetReachable))
        else 
            NetInfo.fetch().then(state => {
                if(state.isInternetReachable)
                    resolve(state.isInternetReachable)
                else
                    setTimeout(() => {
                        NetInfo.fetch().then(state => resolve(state.isInternetReachable))
                    },3000)
            })
    }) 
    
    return await promiseAux;
}

const saveData = async (name,data) => {
    let item = JSON.stringify(data);
    let result = await AsyncStorage.setItem(name,item);
}

const getData = async (name) => {

    let result = await AsyncStorage.getItem(name);

    if(result !== null){
        result = JSON.parse(result);
    }

    return result;
}

function* sagaLogin(items) {
    try {
        let response = undefined;
        let netInfo = yield call(getNetInfo); 

        if(netInfo)
            response = yield call(request,apiConstants.login,items.data,'POST',{
                "Content-Type" : 'application/json',
            });

        if(response === undefined) {
            Toast.show({
                text: "Error al iniciar sesión con tu usuario, verifica la conexión de internet.",
                duration: 6000,
                type: "danger",
                buttonText: "Aceptar",
            });
            yield put(loadAction(false));

    } else {
        let {status, body} = response;
            switch(status) {
                case 200:
                    AsyncStorage.setItem('token',body.access_token);
                    AsyncStorage.setItem('token_type',body.token_type);
                    yield call(sagaInitLoad,{back:false});

                break;
                case 403:
                    Toast.show({
                        text: body.message,
                        duration: 3000,
                        type: "warning",
                        buttonText: "Aceptar",
                    });
                    yield put(loadAction(false));
                break;

                default:
                    if (body.message == "Unauthorized") {
                        Toast.show({
                            text: "Usuario o contraseña invalida",
                            duration: 3000,
                            type: "danger",
                            buttonText: "Aceptar",
                        });
                    } else {
                        Toast.show({
                            text: "Error al iniciar sesion",
                            duration: 3000,
                            type: "danger",
                            buttonText: "Aceptar",
                        });
                    }
                    yield put(loadAction(false));
                    break;
                }
            }

    } catch(e) {
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        yield put(loadAction(false));
        //firebase.crashlytics().log(e);
    }
    //yield put(loadAction(false));
}

function* sagaSendData(items) {
    try {

        let response = undefined;
        let token = yield call(getToken);
        let netInfo = yield call(getNetInfo); 

        if(netInfo)
            response = yield call(request,apiConstants.sendData,items.data,'POST',{
                "Content-Type" : 'application/json',
                "Authorization" : token
            });
            console.log(response)

        if(response === undefined) {
            Toast.show({
                text: "Error al enviar la mantencion",
                duration: 6000,
                type: "danger",
                buttonText: "Aceptar",
            });

    } else {
        let {status, body} = response;
            switch(status) {
                case 200:
                    Toast.show({
                        text: "Datos enviados exitosamente!",
                        duration: 3000,
                        type: "success",
                        buttonText: "Aceptar",
                    });

                break;
                case 403:
                    Toast.show({
                        text: body.message,
                        duration: 3000,
                        type: "warning",
                        buttonText: "Aceptar",
                    });
                break;

                default:
                    Toast.show({
                        text: "Error al enviar la data",
                        duration: 3000,
                        type: "danger",
                        buttonText: "Aceptar",
                    });
                    break;
                }
            }

    } catch(e) {
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        yield put(loadAction(false));
        //firebase.crashlytics().log(e);
    }
    //yield put(loadAction(false));
}



function* sagaLogout(){
    yield put(loadAction(true));
    try{
        let token = yield call(getToken);

        let response = yield call(request,apiConstants.logout,null,'GET',{
            "Content-Type" : 'application/json',
            "Authorization" : token
        });

        for(let obj in SAVE_INDEX){
            let item = SAVE_INDEX[obj];
            AsyncStorage.removeItem(item.name);
        }

        yield call(async () => await AsyncStorage.multiRemove(['token','token_type','userInfo','messageWelcome','selectPortage','selectTurn']));
        yield put(backLogoutAction(true));
        
    }catch(e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        console.log(e);
        //firebase.crashlytics().log(e);
    }
    yield put(loadAction(false));
}

function* sagaInitLoad(item){
    try {
        let token = yield call(getToken);
        let netInfo = yield call(getNetInfo);
        let response = undefined;

        if(netInfo){
            response = yield call(request,apiConstants.doServerGetAllInfo,null,'GET',{
                "Authorization":token,
                "Content-Type" : 'application/json',
            });
        }

        if(response === undefined) {
            Toast.show({
                text: "Error al iniciar sesión con tu usuario, verifica la conexión de internet.",
                duration: 6000,
                type: "danger",
                buttonText: "Aceptar",
            });
            yield put(loadAction(false));

        } else {
            let {status, body} = response;

            let listInstalaciones = body.data.instalaciones;
            let listAreas = body.data.areas;
            let listEquipos = body.data.equipos_servicios;

            yield put(areasInfoAction(listAreas));
            yield put(instInfoAction(listInstalaciones));
            yield put(equipInfoAction(listEquipos));
            yield put(lastInstalationAction(null));
        
            yield call(saveData, SAVE_INDEX.LIST_INSTALACIONES.name, listInstalaciones);
            yield call(saveData, SAVE_INDEX.LIST_AREAS.name, listAreas);
            yield call(saveData, SAVE_INDEX.LIST_EQUIPOS.name, listEquipos);

            // Prueba GUARDADO Y RECUPERACION DE DATOS.
            // let data = yield call(getData,SAVE_INDEX.LIST_INSTALACIONES.name);
            // let data2 = yield call(getData,SAVE_INDEX.LIST_AREAS.name);
            // console.log(data, data2)

            if(!item.back)
                yield put(pushAction(true));

        }

    } catch(e) {
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        console.log(e);
    }
}

export default function* Generator() {
    yield takeEvery(sagasConstants.LOGIN,sagaLogin);
    yield takeEvery(sagasConstants.SENDDATA_REACT,sagaSendData);
    yield takeEvery(sagasConstants.LOGOUT,sagaLogout);
    yield takeEvery(sagasConstants.INIT_LOAD,sagaInitLoad);
}