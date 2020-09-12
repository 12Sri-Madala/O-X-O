import serverInfo from '../../../../Resources/serverInfo.js';
import {
    SAVE_VEHICLE_STARTED,
    SAVE_VEHICLE_SUCCESS,
    SAVE_VEHICLE_FAILURE,
    LOAD_VEHICLES_SUCCESS,
    LOAD_VEHICLES_STARTED,
    LOAD_VEHICLES_FAILURE,
    SAVE_LICENSE_STARTED,
    SAVE_LICENSE_SUCCESS,
    SAVE_LICENSE_FAILURE,
} from './types';

import {AsyncStorage} from 'react-native';

export function loadVehicles(id, token) {
    return async (dispatch) => {
        try {
            fetch(`${serverInfo.name}/vehicles/${id}/${token}`)
                .then((response) => response.json())
                .then((responseJson) => {
                    if(!responseJson.success){
                        console.log('Error:',responseJson.error);
                        // dispatch(fetchDataFailure(responseJson.error));
                        return;
                    }
                    console.log(responseJson);
                    if (responseJson.success) {
                        dispatch(loadVehiclesSuccess(responseJson.payload));
                    }
                })} catch(error) {
            console.log(error);
            // dispatch(saveVehicleFailure(error));
        }
    }
}

function loadVehiclesStarted(){
    return {
        type: LOAD_VEHICLES_STARTED,
    }
}


function loadVehiclesSuccess(payload) {
    return {
        type: LOAD_VEHICLES_SUCCESS,
        payload: payload

    }
}


function loadVehiclesFailure(err){
    return {
        type: LOAD_VEHICLES_FAILURE,
        payload: err,
    }
}

export function saveVehicle(vehicle, nav) {
    return async (dispatch) => {
        dispatch(saveVehicleStarted());
        const payload = JSON.stringify(vehicle);
        const id = await AsyncStorage.getItem('id');
        const token = await AsyncStorage.getItem('token');
        try {
            fetch(`${serverInfo.name}/vehicles/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({payload: payload, token: token, userId: id})
            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    if (responseJson.success) {
                        dispatch(saveVehicleSuccess(responseJson.payload, nav));
                    }
                })
        } catch (error) {
            console.log(error);
           dispatch(saveVehicleFailure(error));
        }
    }
}

function saveVehicleStarted(){
    return {
        type: SAVE_VEHICLE_STARTED,
    }
}

function saveVehicleSuccess(vehicle, nav) {
  nav.navigate('VehicleDetails', {index: vehicle.id});
  return {
    type: SAVE_VEHICLE_SUCCESS,
    index: vehicle.id,
    payload: vehicle
  }
}

function saveVehicleFailure(err){
    return {
        type: SAVE_VEHICLES_FAILURE,
        payload: err,
    }
}

export function saveLicense(vehicle, nav, id) {
  return async (dispatch) => {
    //dispatch(saveLicenseStarted());
    const payload  = JSON.stringify(vehicle);
    const ownerid = await AsyncStorage.getItem('id');
    const token = await AsyncStorage.getItem('token');
    console.log(id);
    console.log(vehicle);
    try {
      fetch(`${serverInfo.name}/vehicles/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({payload:payload, token: token, userId: ownerid, id: id})
      })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.success) {
            dispatch(saveLicenseSuccess(responseJson.payload, nav));
      }
    })} catch(error) {
      console.log(error);
      // dispatch(saveVehicleFailure(error));
    }
  }
}


function saveLicenseStarted(){
    return {
        type: SAVE_LICENSE_STARTED,
    }
}

function saveLicenseSuccess(vehicle, nav) {
  if (nav) nav.navigate('VehicleInfo', {index: vehicle.id});
  return {
    type: SAVE_LICENSE_SUCCESS,
    index: vehicle.id,
    payload: vehicle,
  }
}


function saveLicenseFailure(err){
    return {
        type: SAVE_LICENSE_FAILURE,
        payload: err,
    }
}
