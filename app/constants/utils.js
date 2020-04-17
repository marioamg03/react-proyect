/**
 * Archivo de funciones que utilizare en varias partes del codigo. 
 */
import Geolocation from '@react-native-community/geolocation';

/**
 * Funcion que retorna una promesa el cual obtenemos las coordenadas del dispositivo
 */
export const getLocation = () => {
    return new Promise((resolve,reject) => {
        Geolocation.getCurrentPosition(info => resolve(info),e => resolve(false),{enableHighAccuracy: false, timeout: 15000, maximumAge: 3600000 });  
    })
}