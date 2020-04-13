import {createStore, combineReducers, applyMiddleware,compose} from 'redux';
import Generator from '../sagas/Sagas';
import createSagaMiddleware from 'redux-saga';
//import { persistStore, persistCombineReducers } from 'redux-persist';
//import storage from '@react-native-community/async-storage';

//constants
import storeConstants from '../../constants/store';

const sagaMiddleware = createSagaMiddleware();

/**
 *  STORE GENERALES 
 */
const boolInStore = (state = false, action) => {
    switch(action.type){
        case 'reset':
            return false;
        case storeConstants.BOOL_IN:
            return true;
        default:
            return state;
    }
}

const loadStore = (state = false, action) => {
    switch(action.type){
        case 'reset':
            return false;
        case storeConstants.LOAD:
            return action.bool;
        default:
            return state
    }
};

const pushStore = (state = false, action) => {
    switch(action.type){
        case 'reset':
            return false;
        case storeConstants.PUSH:
            return  action.bool;
        default:
            return state;
    }
};

const indexMenuStore = (state = 1, action) => {
    switch(action.type){
        case 'reset':
            return 1;
        case storeConstants.INDEX_MENU:
            return action.index;
        default:
            return state;
    }
}

const backLogoutStore = (state = false, action) => {
    switch(action.type){
        case 'reset':
            return false;
        case storeConstants.BACK_LOGOUT:
            return action.bool;
        default:
            return state;
    }
}

const listMarkedManagementStore = (state= {} ,action) => {
    switch(action.type){
        case 'reset':
            return {};
        case storeConstants.LIST_MARKED_MANAGEMENT:
            return action.obj;
        default:
            return state;
    }
}

const backAddressStore = (state= null,action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.BACK_ADDRESS:
            return action.address;
        default:
            return state;
    }
}

const backReferredStore = (state = false,action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.BACK_REFERRED:
            return action.bool;
        default:
            return state;
    }
}

const backStore = (state = false,action) => {
    switch(action.type){
        case 'reset':
            return false;
        case storeConstants.BACK_STORE:
            return action.bool;
        default:
            return state;
    }
}

const loadRefreshStore = (state = false,action) => {
    switch(action.type){
        case 'reset':
            return false;
        case storeConstants.LOAD_REFRESH:
            return action.bool;
        default:
            return state;
    }
}

const tailStore = (state = [],action) => {
    switch(action.type){
        case 'reset':
            return [];
        case storeConstants.TAIL:
            return action.list;
        default:
            return state;
    }
}

const stateNetworkStore = (state = true,action) => {
    switch(action.type){
        case 'reset':
            return true;
        case storeConstants.STATE_NETWORK:
            return action.bool;
        default:
            return state;
    }
}

const backNewReferredStore = (state = false,action) => {
    switch(action.type){
        case 'reset':
            return false;
        case storeConstants.BACK_NEW_REFERRED:
            return action.bool;
        default:
            return state;
    }
}

const pushTurnPortageStore = (state = false,action) => {
    switch(action.type){
        case 'reset':
            return false;
        case storeConstants.PUSH_TURN_PORTAGE:
            return action.bool;
        default:
            return state;
    }
}

const pushRegisterStore = (state = null,action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.PUSH_REGISTER:
            return action.bool;
        default:
            return state;
    }
}
/**
 *  END STORE GENERALES 
 */

/**
 *  STORE DATOS DEL USUARIO
 */
const userInfoStore = (state = null, action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.USER_INFO:
            return action.info;
        default:
            return state;
    }
};
/**
 *  END STORE DATOS DEL USUARIO
 */

/**
 *  STORE GESTIONES CON HORA, SIN HORA, TODOS 
 */
const dateListManagementsStore = (state = null, action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.DATE_LIST_MANAGEMENTS:
            return action.date;
        default:
            return state;
    }
} 

const listClientStore = (state = [], action) => {
    switch(action.type){
        case 'reset':
            return [];
        case storeConstants.LIST_CLIENTS:
            return action.list;
        default:
            return state;    
    }
} 

const managementsStore = (state = [], action) => {
    switch(action.type){
        case 'reset':
            return [];
        case storeConstants.LIST_MANAGEMENTS:
            return action.list;
        default:
            return state;
    }
}

const stateManagementsStore = (state = [], action) => {
    switch(action.type){
        case 'reset':
            return [];
        case storeConstants.STATE_MANAGEMENTS:
            return action.list;
        default:
            return state;
    }
}

const selectManagementStore = (state = null, action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.SELECT_MANAGEMENT:
            return action.info;
        default:
            return state;
    }
}

const locationManagementStore = (state = null, action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.LOCATION_MANAGEMENTS:
            return action.location;
        default:
            return state;
    }
}

const typeManagementStore = (state = null, action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.TYPE_MANAGEMENT:
            return action.data;
        default:
            return state;
    }
}

const listAllManagementStore = (state = [], action) => {
    switch(action.type){
        case 'reset':
            return [];
        case storeConstants.LIST_ALL_MANAGEMENT:
            return action.list;
        default:
            return state;
    }
}

const ManagementInProgressStore = (state = {}, action) => {
    switch(action.type){
        case 'reset':
            return {};
        case storeConstants.MANAGEMENT_IN_PROCESS:
            return action.obj;
        default:
            return state;
    }
}
/**
 *  END STORE GESTIONES CON HORA, SIN HORA, TODOS 
 */

 /**
  *  STORE GESTIONES SIGUIENTE GESTION
  */
const setTimeManagementStore = (state= null,action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.SET_TIME_MANAGEMENT:
            return action.time;
        default:
            return state;
    }
}
const setTimeReferenceStore = (state= null,action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.SET_TIME_REFERENCE:
            return action.time;
        default:
            return state;
    }
}
const nextDateListManagementsStore = (state = null, action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.NEXT_DATE_LIST_MANAGEMENTS:
            return action.date;
        default:
            return state;
    }
} 

const nextListClientStore = (state = [], action) => {
    switch(action.type){
        case 'reset':
            return [];
        case storeConstants.NEXT_LIST_CLIENTS:
            return action.list;
        default:
            return state;    
    }
} 

const backNextManagementStore = (state = false, action) => {
    switch(action.type){
        case 'reset':
            return false;
        case storeConstants.BACK_NEXT_MANAGEMENT:
            return action.bool;
        default:
            return state;
    }
}
/**
 * END STORE GESTIONES SIGUIENTE GESTION
 */

/**
 * GESTIONES ANTICIPADAS
 */
const backImageStore = (state = null, action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.BACK_IMAGE:
            return action.image;
        default:
            return state;
    }
}
/**
 * END GESTIONES ANTICIPADAS
 */

/**
 * PORTEO Y TURNO
 */
const listPortageStore = (state = [] , action) => {
    switch(action.type){
        case 'reset':
            return [];
        case storeConstants.LIST_PORTAGE:
            return action.list;
        default:
            return state;
    }
}

const listTurnStore = (state = [] , action) => {
    switch(action.type){
        case 'reset':
            return [];
        case storeConstants.LIST_TURN:
            return action.list;
        default:
            return state;
    }
}

const selectTurnStore = (state = {}, action) => {
    switch(action.type){
        case 'reset':
            return {};
        case storeConstants.SELECT_TURN:
            return action.item;
        default:
            return state;
    }
}

const selectPortageStore = (state = {}, action) => {
    switch(action.type){
        case 'reset':
            return {};
        case storeConstants.SELECT_PORTAGE:
            return action.item;
        default:
            return state;
    }
}
/**
 * END PORTEO Y TURNO
 */
/**
 * Notifications
 */
const listNotificationStore = (state = [], action) => {
    switch(action.type){
        case 'reset':
            return [];
        case storeConstants.LIST_NOTIFICATION:
            return action.list;
        default:
            return state;
    }
}

const newNotificationStore = (state = 0, action) => {
    switch(action.type){
        case 'reset':
            return 0;
        case storeConstants.NEW_NOTIFICATION:
            return action.num;
        default:
            return state;
    }
}
/**
 *END Notifications
 */


const reducers = combineReducers({
    //STORE GENERALES
    boolInStore,
    loadStore,
    pushStore,
    indexMenuStore,
    backLogoutStore,
    backStore,
    backReferredStore,
    loadRefreshStore,
    stateNetworkStore,
    backNewReferredStore,
    pushTurnPortageStore,
    pushRegisterStore,
    //STORE USUARIO INFORMACION
    userInfoStore,
    //STORE GESTIONES CON HORA, SIN HORA, TODOS 
    dateListManagementsStore,
    listClientStore,
    managementsStore,
    selectManagementStore,
    locationManagementStore,
    typeManagementStore,
    listAllManagementStore,
    listMarkedManagementStore,
    ManagementInProgressStore,
    stateManagementsStore,
    // STORE SIGUIENTE GESTION
    setTimeManagementStore,
    setTimeReferenceStore,
    nextDateListManagementsStore,
    nextListClientStore,
    backAddressStore,
    backNextManagementStore,
    // GESTIONES ANTICIPADAS
    backImageStore,
    // PORTEO Y TURNO
    listPortageStore,
    listTurnStore,
    selectTurnStore,
    selectPortageStore,
    tailStore,
    // NOTIFICATION
    listNotificationStore,
    newNotificationStore,
});

export default  createStore(reducers, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(Generator);

