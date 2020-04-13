import {takeEvery, call, select, put} from 'redux-saga/effects';
import {Platform} from 'react-native';
import {Toast} from 'native-base';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import firebase from 'react-native-firebase';

//constants
import apiConstants from '../../constants/api';
import sagasConstants from '../../constants/sagas';

//Redux
import {
    loadAction,
    pushAction,
    userInfoAction,
    backLogoutAction
} 
from '../actions/Actions';

const SAVE_INDEX = {
    USER_INFO:{name: 'USER_INFO', action:userInfoAction},
    LIST_ALL:{name:'LIST_ALL',action:listAllManagementAction},
    LIST_MAN:{name:'LIST_MAN',action:listManagementsAction},
    STATE_MAN:{name:'STATE_MAN',action:stateManagementsAction},
    PORTAGE:{name:'PORTAGE',action:listPortageAction},
    TURN:{name:'TURN',action:listTurnAction},
    TAIL:{name:'TAIL',action:tailAction},
    SELECT_TURN:{name:'SELECT_TURN',action:selectTurnAction},
    SELECT_PORTAGE:{name:'SELECT_PORTAGE',action:selectPortageAction},
    NOTIFICATION_LIST:{name:'NOTIFICATION_LIST',action:listNotificationAction},
    NOTIFICATION_NUM:{name:'NOTIFICATION_NUM',action:newNotificationAction},
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
            default:
                resolve( await request.json() );
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

function* sagaLogin(items){
    try{

        let response = undefined;
        let netInfo = yield call(getNetInfo); 

        if(netInfo)
            response = yield call(request,apiConstants.login,items.data,'POST',{
                "Content-Type" : 'application/json',
            });

        if(response === undefined){
            Toast.show({
                text: "Error al iniciar sesión con tu usuario, verifica la conexión de internet.",
                duration: 6000,
                type: "danger",
                buttonText: "Aceptar",
            });
            yield put(loadAction(false));
        }else
            switch(response.code){
                case '200':
                    AsyncStorage.setItem('token',response.data.access_token);
                    AsyncStorage.setItem('token_type',response.data.token_type);
                    //AsyncStorage.setItem('userInfo',JSON.stringify(response.data.user));
                    yield call(saveData,SAVE_INDEX.USER_INFO.name,response.data.user);
                    yield put(userInfoAction(response.data.user));

                    yield call(sagaInitLoad,{back:false});
                break;
                case '403':
                    Toast.show({
                        text: response.message,
                        duration: 3000,
                        type: "warning",
                        buttonText: "Aceptar",
                    });
                    yield put(loadAction(false));
                break;
            }

    }catch(e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        yield put(loadAction(false));
        firebase.crashlytics().log(e);
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
        firebase.crashlytics().log(e);
    }
    yield put(loadAction(false));
}

function* sagaInitLoad(item){
    try{

        let fecha = moment().format('DD-MM-YYYY');
        let token = yield call(getToken);
        let responseTwo = undefined;
        let response = undefined;
        
        let netInfo = yield call(getNetInfo);

        for(let obj in SAVE_INDEX){
            let item = SAVE_INDEX[obj];
            let action = item.action;
            let data = yield call(getData,item.name);
            
            if(data !== null){
                yield put(action(data));
            }
        }

        if(netInfo)
            yield call(sagaLoadingTail);

        if(netInfo){
            response = yield call(request,apiConstants.listProspectosConGestiones,{fecha},'POST',{
                "Authorization":token,
                "Content-Type" : 'application/json',
            });

            if(response !== undefined){
                responseTwo = yield call(request,apiConstants.listProspectosTodos,null,'GET',{
                    "Authorization":token,
                    "Content-Type" : 'application/json',
                });
            }
        }

        //Eliminar Notificationes viejas
        let notificationList = yield select(state => state.listNotificationStore);

        notificationList = notificationList.filter((v,i) => {
            let dateNotification = moment(v.date,'DD-MM-YYYY HH:mm').day(1);
            dateNotification= moment(dateNotification).format('x');
            let dateNotificationCompare = moment().format('x');
            return dateNotificationCompare >= dateNotification
        })

        yield put(listNotificationAction(notificationList))
        yield call(saveData,SAVE_INDEX.NOTIFICATION_LIST.name,notificationList);


        // Aqui si algunas de las consulta es undefined
        // se agrega la informacion del listado guardado en el storage
        if(response === undefined || responseTwo === undefined){
            let menorFecha = moment(`${fecha} 00:00:00`,'DD-MM-YYYY HH:mm:ss').format('x');
            let mayorFecha = moment(`${fecha} 23:59:59`,'DD-MM-YYYY HH:mm:ss').format('x');
            let listManagements = yield select(state => state.listAllManagementStore);
            
            let prospectos = listManagements.filter((v,i) => {
                let fechaComparar = moment(v.fecha_proxima_gestion).format('x');
                if((fechaComparar >= menorFecha && fechaComparar <= mayorFecha) && v.proxima_gestion_id !== 4){
                    return true;
                }
            });

            yield put(listClientsAction(prospectos));
            if(!item.back)
                yield put(pushAction(true));

        } else {
            if (response.code == 200)
                yield put(listClientsAction(response.data.prospectos));

            if(responseTwo.code == 200){
                let list = responseTwo.data.prospectos;

                list.sort((a,b) => {
                    if(a.nombre < b.nombre)
                        return -1
                    if(b.nombre < a.nombre)
                        return 1
        
                    return 0;
                });

                //Porteo
                let portage = [];

                if(responseTwo.data.porteo !== undefined){
                    portage = responseTwo.data.porteo;
                }

                //Turno
                let turn = [];

                if(responseTwo.data.turno !== undefined){
                    turn = responseTwo.data.turno;
                }
                
                yield put(listAllManagementAction(list));
                yield put(listManagementsAction(responseTwo.data.gestiones));
                yield put(stateManagementsAction(responseTwo.data.estados));
                yield put(listPortageAction(portage));
                yield put(listTurnAction(turn));

                yield call(saveData,SAVE_INDEX.LIST_ALL.name,list);
                yield call(saveData,SAVE_INDEX.LIST_MAN.name,responseTwo.data.gestiones);
                yield call(saveData,SAVE_INDEX.STATE_MAN.name,responseTwo.data.estados);
                yield call(saveData,SAVE_INDEX.PORTAGE.name,portage);
                yield call(saveData,SAVE_INDEX.TURN.name,turn);
                
                if(!item.back)
                    yield put(pushAction(true));
            }
        }

    }catch(e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        console.log(e);
        firebase.crashlytics().log(e);
    }
}

function* sagaGetListManagements(item){
    yield put(loadAction(true));
    try{
        if(!item.next){
            yield put(dateListManagementsAction(item.date));
            yield put(listClientsAction([]));
        } else {
            yield put(nextDateListManagementsAction(item.date));
            yield put(nextListClientsAction([]));
        }
        
        let token = yield call(getToken);
        let response = undefined;

        let netInfo = yield call(getNetInfo);

        if(netInfo)
            response = yield call(request,apiConstants.listProspectosConGestiones,{fecha:moment(item.date).format('DD-MM-YYYY')},'POST',{
                "Authorization":token,
                "Content-Type" : 'application/json',
            });

        if(response === undefined){
            
            let fecha = moment(item.date).format('YYYY-MM-DD');
            let menorFecha = moment(`${fecha} 00:00:00`).format('x');
            let mayorFecha = moment(`${fecha} 23:59:59`).format('x');
            let listManagements = yield select(state => state.listAllManagementStore);
            let list = listManagements.filter((v,i) => {
                let fechaComparar = moment(v.fecha_proxima_gestion).format('x');
                if((fechaComparar >= menorFecha && fechaComparar <= mayorFecha) && v.proxima_gestion_id !== 4){
                    return true;
                }
            });

            if(!item.next){
                let index = yield select(state => state.indexMenuStore)

                if(index == 3){
                    list = list.filter((v,i) => v.origen_dato == 'fyce DCH' )
                } else if(index == 4){
                    list = list.filter((v,i) => v.origen_dato == 'fyce DSH' )
                }

                yield put(listClientsAction(list));
                yield put(pushAction(true));
            } else 
                yield put(nextListClientsAction(list));

        }else
            switch(response.code){
                case '200':
                    if(!item.next){

                        let list = response.data.prospectos;
                        let index = yield select(state => state.indexMenuStore)

                        if(index == 3){
                            list = list.filter((v,i) => v.origen_dato == 'fyce DCH' )
                        } else if(index == 4){
                            list = list.filter((v,i) => v.origen_dato == 'fyce DSH' )
                        }

                        yield put(listClientsAction(list));
                        yield put(pushAction(true));
                    } else 
                        yield put(nextListClientsAction(response.data.prospectos));
                break;
            }
    }catch(e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        yield put(loadAction(false));
        console.log(e);
        firebase.crashlytics().log(e);
    }
    yield put(loadAction(false));
}

function* sagaUpdateManagements(item){
    yield put(loadAction(true));
    try{
        let token = yield call(getToken);
        let response = undefined;

        let netInfo = yield call(getNetInfo);
        
        if(netInfo)
            response = yield call(request,apiConstants.actualizarProspecto,item.items,'POST',{
                "Authorization":token,
                "Content-Type" : 'application/json',
            });
        
        if(response === undefined){

            let listTail = yield select(store => store.tailStore);
            listTail.push({
                type: 3,
                obj:item.items,
                timer:moment().format(),
            });
            yield put(tailAction(listTail));
            yield call(saveData,SAVE_INDEX.TAIL.name,listTail);

            let managementSelect = yield select (store => store.selectManagementStore);
            let managements = yield select (store => store.listClientStore);
            let keyManagement = null;

            managements.map((v,i) => {
                if(v.id == item.items.prospect_id){
                    keyManagement = i;
                }
            });

            managements[keyManagement] = {...managements[keyManagement],...{
                direccion_1:item.items.direccion_1,
                direccion_2:item.items.direccion_2,
                direccion_3:item.items.direccion_3,
                telefono_1:item.items.telefono_1,
                telefono_2:item.items.telefono_2,
                telefono_3:item.items.telefono_3,
            }};

            yield put(selectManagementAction({...managementSelect,...{
                direccion_1:item.items.direccion_1,
                direccion_2:item.items.direccion_2,
                direccion_3:item.items.direccion_3,
                telefono_1:item.items.telefono_1,
                telefono_2:item.items.telefono_2,
                telefono_3:item.items.telefono_3,
            }}));

            yield put(listClientsAction(managements));
            yield put(backReferredAction(true));
        } else {
            switch(response.code){
                case '200':
                    let managementSelect = yield select (store => store.selectManagementStore);
                    let managements = yield select (store => store.listClientStore);
                    let keyManagement = null;

                    managements.map((v,i) => {
                        if(v.id == item.items.prospect_id){
                            keyManagement = i;
                        }
                    });

                    managements[keyManagement] = {...managements[keyManagement],...{
                        direccion_1:item.items.direccion_1,
                        direccion_2:item.items.direccion_2,
                        direccion_3:item.items.direccion_3,
                        telefono_1:item.items.telefono_1,
                        telefono_2:item.items.telefono_2,
                        telefono_3:item.items.telefono_3,
                    }};

                    yield put(selectManagementAction({...managementSelect,...{
                        direccion_1:item.items.direccion_1,
                        direccion_2:item.items.direccion_2,
                        direccion_3:item.items.direccion_3,
                        telefono_1:item.items.telefono_1,
                        telefono_2:item.items.telefono_2,
                        telefono_3:item.items.telefono_3,
                    }}));

                    yield put(listClientsAction(managements));
                    yield put(backReferredAction(true));
                break;
                case '400':
                    Toast.show({
                        text: response.message,
                        duration: 3000,
                        type: "warning",
                        buttonText: "Aceptar",
                    });
                break;
            }
        }

    }catch(e) {
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        yield put(loadAction(false));
        console.log(e);
        firebase.crashlytics().log(e);
    }
    yield put(loadAction(false));
}

function* sagaNewManagement(item){
    yield put(loadAction(true));
    try{
        let token = yield call(getToken);
        let response = undefined;
        let netInfo = yield call(getNetInfo);

        console.log(item.items);
        if(netInfo)
            response = yield call(request,apiConstants.guardarNuevaGestion,item.items,'POST',{
                "Authorization":token,
                "Content-Type" : 'application/json',
            });
        
        if(response === undefined){

            // Consultamos la lista de pendientes para poder agregar otro
            let listTail = yield select(store => store.tailStore);
            listTail.push({
                type: 2,
                obj:item.items,
                timer:moment().format(),
            });
            yield put(tailAction(listTail));
            yield call(saveData,SAVE_INDEX.TAIL.name,listTail);

            let listManagements = yield select(state => state.listAllManagementStore);

            let indexItem = null;

            listManagements.map((v,e) => {
                if(v.id === item.items.prospect_id)
                    indexItem = e;
            });
            
            if(indexItem !== null)
                listManagements[indexItem] = {
                    ...listManagements[indexItem],
                    ...item.items,
                    ...{
                        fecha_proxima_gestion:moment(item.items.fecha_proxima_gestion,'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
                        proxima_gestion_id:( parseInt(item.items.proxima_gestion_id))
                    }
                }

            let fecha = yield select(state => state.dateListManagementsStore);
            fecha = fecha === null ? moment().format('YYYY-MM-DD') : moment(fecha).format('YYYY-MM-DD');
            let menorFecha = moment(`${fecha} 00:00:00`,'YYYY-MM-DD HH:mm:ss').format('x');
            let mayorFecha = moment(`${fecha} 23:59:59`,'YYYY-MM-DD HH:mm:ss').format('x');
            
            let listClient = listManagements.filter((v,i) => {
                let fechaComparar = moment(v.fecha_proxima_gestion).format('x');
                if((fechaComparar >= menorFecha && fechaComparar <= mayorFecha) && v.proxima_gestion_id !== 4){
                    return true;
                }
            });

            yield put(listAllManagementAction(listManagements));
            yield call(saveData,SAVE_INDEX.LIST_ALL.name,listManagements);
            yield put(listClientsAction(listClient));

            Toast.show({
                text: 'Éxito al crear gestión, por falta de conexión lo agregamos a la cola de pendiente.',
                duration: 3000,
                type: "warning",
                buttonText: "Aceptar",
            });

            yield put(backAction(true));
        } else {
            switch(response.code){
                case '200':
                    Toast.show({
                        text: response.message,
                        duration: 3000,
                        type: "success",
                        buttonText: "Aceptar",
                    });

                    let responseList = yield call(request,apiConstants.listProspectosTodos,null,'GET',{
                        "Authorization":token,
                        "Content-Type" : 'application/json',
                    });

                    if (responseList.code == '200'){
                        let fecha = yield select(state => state.dateListManagementsStore);
                        fecha = fecha === null ? moment().format('YYYY-MM-DD') : moment(fecha).format('YYYY-MM-DD');
                        let menorFecha = moment(`${fecha} 00:00:00`,'YYYY-MM-DD HH:mm:ss').format('x');
                        let mayorFecha = moment(`${fecha} 23:59:59`,'YYYY-MM-DD HH:mm:ss').format('x');

                        let listClient = responseList.data.prospectos.filter((v,i) => {
                            let fechaComparar = moment(v.fecha_proxima_gestion).format('x');
                            if((fechaComparar >= menorFecha && fechaComparar <= mayorFecha) && v.proxima_gestion_id !== 4){
                                return true;
                            }
                        });
                        yield put(listClientsAction(listClient));
                        yield put(listAllManagementAction(responseList.data.prospectos));
                    }

                    yield put(backAction(true));
                break;
                case '400':
                    Toast.show({
                        text: response.message,
                        duration: 3000,
                        type: "warning",
                        buttonText: "Aceptar",
                    });
                break;
            }
        }

    }catch(e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        yield put(loadAction(false));
        console.log(e);
        firebase.crashlytics().log(e);
    }
    yield put(loadAction(false));
}

function* sagaNewClient(item){
    yield put(loadAction(true));
    try{
        let token = yield call(getToken);
        let ManagementInProgress = yield select(state => state.ManagementInProgressStore);
        let indexMenu = yield select(state => state.indexMenuStore);
        let response = undefined;
        let netInfo = yield call(getNetInfo);

        // Comprobamos si hay conexión para ejecutar la consulta
        if(netInfo)
            response = yield call(request,apiConstants.crearPropecto,item.obj,'POST',{
                "Authorization":token,
                "Content-Type" : 'application/json',
            });
        
        //Si no hay conexión se utiliza los datos almacenados
        if(response === undefined){

            // Consultamos la lista de pendientes para poder agregar otro
            let listTail = yield select(store => store.tailStore);
            listTail.push({
                type: 1,
                obj:item.obj,
                timer:moment().format(),
            });
            yield put(tailAction(listTail));
            yield call(saveData,SAVE_INDEX.TAIL.name,listTail);

            //Aqui consultamos la lista de gestiones para agregar la gestion creada sin conexión
            let listManagements = yield select(state => state.listAllManagementStore);
            listManagements.push({
                ...item.obj,
                ...{
                    fecha_proxima_gestion:moment(item.obj.fecha_proxima_gestion,'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
                    proxima_gestion_id:( parseInt(item.obj.proxima_gestion_id))
                }
            });
            yield put(listAllManagementAction(listManagements));
            yield call(saveData,SAVE_INDEX.LIST_ALL.name,listManagements);

            if(ManagementInProgress.prospect_id !== undefined){
                yield call(sagaNewManagement,{items:ManagementInProgress});
            } else {
                if(indexMenu == 6 || indexMenu == 7){
                    yield call(sagaInitLoad,{back:true});
                    yield put(backAction(true));
                } else if(indexMenu == 5) {
                    yield put(backNewReferredAction(true));
                    yield put(indexMenuAction(1));
                }

                Toast.show({
                    text: 'Éxito al crear referido, por falta de conexión lo agregamos a la cola de pendiente.',
                    duration: 3000,
                    type: "warning",
                    buttonText: "Aceptar",
                });
            }

        } else {
            switch(response.code){
                case '200':
                    
                    if(ManagementInProgress.prospect_id !== undefined){
                        yield call(sagaNewManagement,{items:ManagementInProgress});
                    } else {

                        if(indexMenu == 6 || indexMenu == 7){
                            yield call(sagaInitLoad,{back:true});
                            yield put(backAction(true));
                        } else if(indexMenu == 5) {
                            yield put(backNewReferredAction(true));
                            yield put(indexMenuAction(1));
                        }

                        Toast.show({
                            text: response.message,
                            duration: 3000,
                            type: "success",
                            buttonText: "Aceptar",
                        });
                    }

                break;
                case '400':
                    Toast.show({
                        text: response.message,
                        duration: 3000,
                        type: "warning",
                        buttonText: "Aceptar",
                    });
                break;
            }
        }

    } catch(e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        yield put(loadAction(false));
        console.log(e);
        firebase.crashlytics().log(e);
    }
    yield put(loadAction(false));
}

function* sagaWalletList(item){
    yield put(loadRefreshAction(true));
    try{
        let token = yield call(getToken);
        let response = undefined;
        let netInfo = yield call(getNetInfo);

        if(netInfo)
            response = yield call(request,apiConstants.listProspectosTodos,null,'GET',{
                "Authorization":token,
                "Content-Type" : 'application/json',
            });

        if(response !== undefined && response.code == 200){
            let list = response.data.prospectos;

            list.sort((a,b) => {
                if(a.nombre < b.nombre)
                    return -1
                if(b.nombre < a.nombre)
                    return 1
    
                return 0;
            });

            //Porteo
            let portage = [];

            if(response.data.porteo !== undefined){
                portage = response.data.porteo;
            }

            //Turno
            let turn = [];

            if(response.data.turno !== undefined){
                turn = response.data.turno;
            }

            yield put(listAllManagementAction(list))
            yield put(listPortageAction(portage));
            yield put(listTurnAction(turn))

            yield call(saveData,SAVE_INDEX.LIST_ALL.name,list);
            yield call(saveData,SAVE_INDEX.PORTAGE.name,portage);
            yield call(saveData,SAVE_INDEX.TURN.name,turn);
        }

    } catch(e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        console.log(e);
        yield put(loadRefreshAction(false));
        firebase.crashlytics().log(e);
    }
    yield put(loadRefreshAction(false));
}

function* sagaSaveActivity(item){
    try{
        let token = yield call(getToken);
        let listTail = yield select(store => store.tailStore);
        let indexMenu = yield select(store => store.indexMenuStore);
        let netInfo = yield call(getNetInfo);
        let response = undefined;
        yield put(pushTurnPortageAction(false));

        if(netInfo){
            response = yield call(request,apiConstants.guardarCoordenadasActividad,item.items,'POST',{
                "Authorization":token,
                "Content-Type" : 'application/json',
            });
        }

        if(response === undefined){

            
            listTail.push({
                type: 4,
                obj:item.items,
                timer:moment().format(),
            });
            yield put(tailAction(listTail));
            yield call(saveData,SAVE_INDEX.TAIL.name,listTail);

            let select = {...item.select,...item.items}
            //PROVICIONAL MIENTRAS SE COLOCA LA BASE DE DATOS LOCAL
            if(indexMenu == 6){
                yield put(selectTurnAction(select))
                yield call(saveData,SAVE_INDEX.SELECT_TURN.name,select);
            }else{
                yield put(selectPortageAction(select))
                yield call(saveData,SAVE_INDEX.SELECT_PORTAGE.name,select);
            }

            Toast.show({
                text: indexMenu == 6 ? "Turno Iniciado correctamente" : "Porteo Iniciado correctamente",
                duration: 2000,
                type: "success",
                buttonText: "Aceptar",
            });
            yield put(pushTurnPortageAction(true));

        }else{
            switch(response.code){
                case '200':
                    let select = {...item.select,...item.items}
                    //PROVICIONAL MIENTRAS SE COLOCA LA BASE DE DATOS LOCAL
                    if(indexMenu == 6){
                        yield put(selectTurnAction(select))
                        yield call(saveData,SAVE_INDEX.SELECT_TURN.name,select);
                    }else{
                        yield put(selectPortageAction(select))
                        yield call(saveData,SAVE_INDEX.SELECT_PORTAGE.name,select);
                    }

                    Toast.show({
                        text: indexMenu == 6 ? "Turno Iniciado correctamente" : "Porteo Iniciado correctamente",
                        duration: 2000,
                        type: "success",
                        buttonText: "Aceptar",
                    });
                    yield put(pushTurnPortageAction(true));
                break;
                case '400':
                    Toast.show({
                        text: response.message,
                        duration: 3000,
                        type: "warning",
                        buttonText: "Aceptar",
                    });
                break;
            }
        }
    } catch (e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        console.log(e);
        yield put(loadAction(false));
        firebase.crashlytics().log(e);
    }
    yield put(loadAction(false));
}

function* sagaSaveTokenFirebase(item){
    try{
        let token = yield call(getToken);
        let netInfo = yield call(getNetInfo);
        let response = undefined;

        if(netInfo)
            response = yield call(request,apiConstants.actualizarTokenNotificacionVendedor
                                    ,{token_push_mobile:item.token},'POST',{
                "Authorization":token,
                "Content-Type" : 'application/json',
            });

        if(response !== undefined)
            switch(response.code){
                case '200':
                    
                break;
                case '400':

                break;
            }
    } catch(e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        console.log(e);
        firebase.crashlytics().log(e);
    }
}

function* sagaLoadingTail(item){
    try{
        let token = yield call(getToken);
        let tail = yield select(store => store.tailStore);
        //console.log(tail);
        let tailArray = tail;
        let refreshClient = false;

        for(let i = 0; i<tailArray.length ; i++ ){
            let data = tailArray[i];

            //NUEVA REFERENCIA
            if(data.type == 1){
                let response = yield call(request,apiConstants.crearPropecto,data.obj,'POST',{
                    "Authorization":token,
                    "Content-Type" : 'application/json',
                });

                if(response !== undefined && response.code == 200){
                    refreshClient = true;
                    tail = tail.filter((v,e) => e !== i);
                    yield put(tailAction(tail));
                    yield call(saveData,SAVE_INDEX.TAIL.name,tail);

                    let listManagements = yield select(state => state.listAllManagementStore);
                    let data = response.data[0];

                    let indexItem = null;

                    listManagements.map((v,e) => {
                        if(v.app_id === data.app_id)
                            indexItem = e;
                    });

                    listManagements[indexItem] = {...listManagements[indexItem],...{id:data.prospect_id}}

                    yield put(listAllManagementAction(listManagements));
                    yield call(saveData,SAVE_INDEX.LIST_ALL.name,listManagements);
                } else {
                    //return false;
                    break;
                }
            }

            //GESTIONES
            if(data.type == 2){
                let response = yield call(request,apiConstants.guardarNuevaGestion,data.obj,'POST',{
                    "Authorization":token,
                    "Content-Type" : 'application/json',
                });

                if(response !== undefined && response.code == 200){
                    tail = tail.filter((v,e) => e !== i);
                    yield put(tailAction(tail));
                    yield call(saveData,SAVE_INDEX.TAIL.name,tail);
                } else {
                    //return false;
                    break;
                }
            }

            // MODIFICAR REFERIDO DATOS
            if(data.type == 3){
                let response = yield call(request,apiConstants.actualizarProspecto,data.obj,'POST',{
                    "Authorization":token,
                    "Content-Type" : 'application/json',
                });

                if(response !== undefined && response.code == 200){
                    tail = tail.filter((v,e) => e !== i);
                    yield put(tailAction(tail));
                    yield call(saveData,SAVE_INDEX.TAIL.name,tail);

                    let dataResponse = response.data[0];
                    let listManagements = yield select(state => state.listAllManagementStore);
                    let listClient= yield select(state => state.listClientStore);

                    let indexItem = null;
                    let indexItemClient = null;

                    listManagements.map((v,e) => {
                        if(v.id === dataResponse.prospect_id)
                            indexItem = e;
                    });

                    listClient.map((v,e) => {
                        if(v.id === dataResponse.prospect_id)
                            indexItemClient = e;
                    });

                    let objSet = {
                        direccion_1:data.obj.direccion_1,
                        direccion_2:data.obj.direccion_2,
                        direccion_3:data.obj.direccion_3,
                        telefono_1:data.obj.telefono_1,
                        telefono_2:data.obj.telefono_2,
                        telefono_3:data.obj.telefono_3,
                    }

                    listManagements[indexItem] = {...listManagements[indexItem],...objSet}
                    listClient[indexItemClient] = {...listClient[indexItemClient],...objSet}

                    yield put(listAllManagementAction(listManagements));
                    yield call(saveData,SAVE_INDEX.LIST_ALL.name,listManagements);
                    yield put(listClientsAction(listClient));
                } else {
                    //return false;
                    break;
                }
            }

            // ABRIR UNA ACTIVIDAD SEA PORTEO O TURNO
            if(data.type == 4){
                let response = yield call(request,apiConstants.guardarCoordenadasActividad,data.obj,'POST',{
                    "Authorization":token,
                    "Content-Type" : 'application/json',
                });

                if(response !== undefined && response.code == 200){
                    tail = tail.filter((v,e) => e !== i);
                    yield put(tailAction(tail));
                    yield call(saveData,SAVE_INDEX.TAIL.name,tail);
                } else {
                    //return false;
                    break;
                }
            }

        }

        if(refreshClient){
            yield put(listClientsAction([]));

            let dateListManagements = yield select(store => store.dateListManagementsStore);
            let fecha = moment(dateListManagements).format('YYYY-MM-DD');
            let menorFecha = moment(`${fecha} 00:00:00`).format('x');
            let mayorFecha = moment(`${fecha} 23:59:59`).format('x');
            let listManagements = yield select(state => state.listAllManagementStore);
            
            let prospectos = listManagements.filter((v,i) => {
                let fechaComparar = moment(v.fecha_proxima_gestion).format('x');
                if((fechaComparar >= menorFecha && fechaComparar <= mayorFecha) && v.proxima_gestion_id !== 4){
                    return true;
                }
            });

            yield put(listClientsAction(prospectos));
        }

    } catch (e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        console.warn(e);
        firebase.crashlytics().log(e);
    }
}

function* sagaUpdateTurnPortage(){
    try{
        let token = yield call(getToken);
        let netInfo = yield call(getNetInfo);
        let response = undefined;

        if(netInfo){
            response = yield call(request,apiConstants.listarTurnosPorteosPorVendedor,null,'GET',{
                "Authorization":token,
                "Content-Type" : 'application/json',
            });

            switch(response.code){
                case '200':
                    //Porteo
                    let portage = [];

                    if(response.data.porteo !== undefined){
                        portage = response.data.porteo;
                    }

                    //Turno
                    let turn = [];

                    if(response.data.turno !== undefined){
                        turn = response.data.turno;
                    }

                    yield put(listPortageAction(portage));
                    yield put(listTurnAction(turn));
                    
                    yield call(saveData,SAVE_INDEX.PORTAGE.name,portage);
                    yield call(saveData,SAVE_INDEX.TURN.name,turn);
                break;
            }
        }

    } catch(e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        console.log(e);
        firebase.crashlytics().log(e);
    }
}

function* sagaRegister(item){
    yield put(loadAction(true));
    try{
        let netInfo = yield call(getNetInfo);

        if(netInfo){
            let response = yield call(request,apiConstants.registerApp,item.info,'POST',{
                "Content-Type" : 'application/json',
            });

            if(response.code == '200'){
                yield put(loadAction(false));
                yield put(pushRegisterAction(response.user_exist));
            }
        }

    } catch (e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        yield put(loadAction(false));
        console.log(e);
        firebase.crashlytics().log(e);
    }
    //yield put(loadAction(false));
}

function* sagaSaveNotification(item){
    try{
        let {title,body} = item.obj;
        let notificationList = yield select(state => state.listNotificationStore);
        let notificationNum = yield select(state => state.newNotificationStore);

        notificationList.unshift({
            title,
            body,
            date:moment().format('DD-MM-YYYY HH:mm'),
        });
        let num = notificationNum + 1;
        
        yield put(listNotificationAction(notificationList))
        yield put(newNotificationAction(num))
        
        yield call(saveData,SAVE_INDEX.NOTIFICATION_LIST.name,notificationList);
        yield call(saveData,SAVE_INDEX.NOTIFICATION_NUM.name,num);
    } catch(e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        yield put(loadAction(false));
        console.log(e);
        firebase.crashlytics().log(e);
    }
}

function* sagaResetNotification(){
    try{
        yield put(newNotificationAction(0))
        yield call(saveData,SAVE_INDEX.NOTIFICATION_NUM.name,0);
    }catch(e){
        Toast.show({
            text: "Error a realizar la consulta, comuníquese con soporte tecnico.",
            duration: 3000,
            type: "warning",
            buttonText: "Aceptar",
        });
        yield put(loadAction(false));
        console.log(e);
        firebase.crashlytics().log(e);
    }
}

export default function* Generator() {
    yield takeEvery(sagasConstants.LOGIN,sagaLogin);
    yield takeEvery(sagasConstants.LOGOUT,sagaLogout);
    yield takeEvery(sagasConstants.INIT_LOAD,sagaInitLoad);
    yield takeEvery(sagasConstants.GET_LIST_MANAGEMENTS,sagaGetListManagements);
    yield takeEvery(sagasConstants.UPDATE_MANAGEMENTS,sagaUpdateManagements);
    yield takeEvery(sagasConstants.SAVE_NEW_MANAGEMENT,sagaNewManagement);
    yield takeEvery(sagasConstants.SAVE_NEW_CLIENT,sagaNewClient);
    yield takeEvery(sagasConstants.WALLET_LIST,sagaWalletList);
    yield takeEvery(sagasConstants.SAVE_ACTIVITY,sagaSaveActivity);
    yield takeEvery(sagasConstants.SAVE_TOKEN_FIREBASE,sagaSaveTokenFirebase);
    yield takeEvery(sagasConstants.UPDATE_TAIL,sagaLoadingTail);
    yield takeEvery(sagasConstants.UPDATE_TURN_PORTAGE,sagaUpdateTurnPortage);
    yield takeEvery(sagasConstants.REGISTER,sagaRegister);
    yield takeEvery(sagasConstants.NOTIFICATION,sagaSaveNotification);
    yield takeEvery(sagasConstants.RESET_NUM_NOTIFICATION,sagaResetNotification)
}