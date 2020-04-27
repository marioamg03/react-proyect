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
 * Actions SendData
 */
export const sendDataAction = data => ({
    type:sagasConstants.SENDDATA_REACT,
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

export const equipInfoAction = list => ({
    type:storeConstants.LIST_EQUIP_INFO,
    list
})

export const lastInstalationAction = data => ({
    type:storeConstants.LAST_INSTALATION,
    data
});

export const lastEquipManagementAction = data => ({
    type:storeConstants.LAST_EQUIP,
    data
});

//Si el tipo de gestion es de instalacion o equipo
//True instalacion, False Equipo
export const lastTypeManagementAction = bool => ({
    type: storeConstants.MANAGEMENT_TYPE,
    bool
});

/**
 * Gestiones Anticipadas
 */
export const backImageAction = image => ({
    type:storeConstants.BACK_IMAGE,
    image
});


