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

const listAllInstStore = (state = [], action) => {
    switch(action.type){
        case 'reset':
            return [];
        case storeConstants.LIST_INST_INFO:
            return action.list;
        default:
            return state;
    }
}

const listAllEquipStore = (state = [], action) => {
    switch(action.type){
        case 'reset':
            return [];
        case storeConstants.LIST_EQUIP_INFO:
            return action.list;
        default:
            return state;
    }
}

const nextInstalationStore = (state = null, action) => {
    switch(action.type){
        case 'reset':
            return null;
        case storeConstants.LAST_INSTALATION:
            return action.data;
        default:
            return state;
    }
}

const reducers = combineReducers({
    //STORE GENERALES
    boolInStore,
    loadStore,
    pushStore,
    listAllInstStore,
    listAllEquipStore,
    nextInstalationStore
});

export default  createStore(reducers, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(Generator);

