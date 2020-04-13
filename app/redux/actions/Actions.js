//constans 
import storeConstans from '../../constants/store';

/**
 * Actions Generales
 */
export const loadAction = bool => ({
    type:storeConstans.LOAD,
    bool
});