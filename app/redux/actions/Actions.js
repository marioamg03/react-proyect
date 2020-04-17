//constans 
import sagasConstants from '../../constants/sagas';
import storeConstants from '../../constants/store';

/**
 * Actions Generales
 */
export const loadAction = bool => ({
    type:storeConstants.LOAD,
    bool
});

/**
 * Actions Login
 */
export const loginAction = data => ({
    type:sagasConstants.LOGIN,
    data
});


/**
 * Actions Push
 */
export const pushAction = bool => ({
    type: storeConstants.PUSH,
    bool
})

/**
 * Actions Login Save
 */
export const areasInfoAction = list => ({
    type:storeConstants.LIST_AREAS_INFO,
    list
})

export const instInfoAction = list => ({
    type:storeConstants.LIST_INST_INFO,
    list
})

