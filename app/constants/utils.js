/**
 * Archivo de funciones que utilizare en varias partes del codigo. 
 */
import React from 'react';
import {View,Text} from 'react-native';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import { showLocation } from 'react-native-map-link';

export const OriginData = (item) => {
    let text = '';
    let color = '';
    switch(item.origen_dato){
        case 'fyce DCH':
            text='DCH';
            color='#FF9700';
        break;
        case 'fyce DSH':
            text='DSH';
            color='#E27E5F';
        break;
        case 'fyce PRM':
            text='PRE';
            color='#A98D00';
        break;
        case 'porteo':
            text='POR';
            color='#34ABA0';
        break;
        case 'turno':
            text='TUR';
            color='#01DF01';
        break;
        case 'referido propio':
            text='PRO';
            color='#267F27';
        break;
        case 'referido cliente':
            text='PRO';
            color='#267F27';
        break;
        case 'inteligencia negocio':
            text='CAM';
            color='#8D4700';
        break;
        case 'referido vendedor':
            text='REF';
            color='#16A085';
        break;
    }

    return <View style={{width:'100%',height:'100%',backgroundColor: item.id === undefined ? '#CCCCCC' : color,justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:'#ffffff',fontSize:15}} >{text}</Text>
    </View>
}

export const addresses = (item) => {

    if(item.direccion_proxima_gestion !== null){
        if (item.direccion_proxima_gestion == 1)
            return item.direccion_1;
        
        if (item.direccion_proxima_gestion == 2)
            return item.direccion_2;

        if (item.direccion_proxima_gestion == 3)
            return item.direccion_3;
    } else {
        if (item.direccion_1 !== null && item.direccion_1 !== undefined)
            return item.direccion_1;
        
        if (item.direccion_2 !== null && item.direccion_2 !== undefined)
            return item.direccion_2;

        if (item.direccion_3 !== null && item.direccion_3 !== undefined)
            return item.direccion_3;
    }

    return 'Sin Dirección';
}

export const lastManagement = (item,managements) => {
    let result = '';
    let managementsName = ''; 
    managements.map(v => {
        if(v.id === item.gestion_id)
            managementsName = v.nombre
    });

    let date = moment(item.fecha_ultima_gestion).format('DD-MM-YYYY HH:mm');

    result = `UG: ${managementsName} ${date}`;
    return result;
}

export const nextManagement = (item,managements) => {
    let result = '';
    let managementsName = ''; 
    managements.map(v => {
        if(v.id === item.proxima_gestion_id)
            managementsName = v.nombre
    });

    if(item.fecha_proxima_gestion){
        let date = moment(item.fecha_proxima_gestion).format('DD-MM-YYYY HH:mm');
        result = item.proxima_gestion_id !== 4 ? `PG: ${managementsName} ${date}` :`PG: ${managementsName}`  ;
    } else{
        result = `PG: Sin Próxima Gestión`;
    }

    return result;
}

export const phono = (item) => {
    if(item.app_telefono_liberado != 'no')
        if(item.telefono_1 !== null)
            return item.telefono_1
        if(item.telefono_2 !== null)
            return item.telefono_2
        if(item.telefono_3 !== null)
            return item.telefono_3
    else if((item.app_telefono_liberado == 'no' || item.prospect_record.length <= 1 )&& item.origen_dato == 'fyce DCH') 
        return 'No Disponible';

    return '';
}

/**
 * Funcion que retorna una promesa el cual obtenemos las coordenadas del dispositivo
 */
export const getLocation = () => {
    return new Promise((resolve,reject) => {
        Geolocation.getCurrentPosition(info => resolve(info),e => resolve(false),{enableHighAccuracy: false, timeout: 15000, maximumAge: 3600000 });  
    })
}

// DEEP LINKING GOOGLE MAPS AND WAZE
export const setMaps = async (item,type) => {

    let location = await getLocation();
    let longitud_dir = null;
    let latitud_dir = null;
    
    if(item.direccion_proxima_gestion !== null){
        if (item.direccion_proxima_gestion == 1){
            longitud_dir = item.longitud_dir_1;
            latitud_dir = item.latitud_dir_1;
        } else if(item.direccion_proxima_gestion == 2){
            longitud_dir = item.longitud_dir_2;
            latitud_dir = item.latitud_dir_2;
        } else if(item.direccion_proxima_gestion == 3){
            longitud_dir = item.longitud_dir_3;
            latitud_dir = item.latitud_dir_3;
        }
    } else {
        longitud_dir = item.longitud_dir_1;
        latitud_dir = item.latitud_dir_1;
    }

    if(longitud_dir === null && latitud_dir === null){
        Toast.show({
            text: 'No tiene una dirección de destino',
            duration: 6000,
            type: "danger",
            buttonText: "Aceptar",
        });
        return false;
    }

    if(location) 
        showLocation({
            latitude: latitud_dir,
            longitude: longitud_dir,
            sourceLatitude: location.coords.latitude,  // optionally specify starting location for directions
            sourceLongitude: location.coords.longitude,  // not optional if sourceLatitude is specified
            //title: 'The White House',  // optional
            //googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
            //googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
            //alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
            //dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
            //dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
            //cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
            appsWhiteList: [type == 1 ? 'google-maps' : 'waze'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
            
        })
    else 
        Toast.show({
            text: 'Debe tener el GPS activado para poder continuar',
            duration: 6000,
            type: "danger",
            buttonText: "Aceptar",
        });
}