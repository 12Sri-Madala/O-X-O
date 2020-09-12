import {
    UPDATE_DATA_STARTED,
    UPDATE_DATA_SUCCESS,
    UPDATE_DATA_FAILURE
} from './types';

import serverInfo from '../../../Resources/serverInfo';

export function updateData(data, id, token){
    return (dispatch) => {
        dispatch(updateDataStarted());
        try {
            fetch(`${serverInfo.name}/library/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({payload: data, id: id, token: token})
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.success) {
                    dispatch(updateDataSuccess(responseJson));
                } else  {
                    dispatch(updateDataFailure(responseJson));
                }
            })
            .catch((error) => dispatch(updateDataFailure({error:error})));
        } catch(error) {
            console.log(error);
            dispatch(updateDataFailure({error:error}));
        }
    }
}

function updateDataStarted(){
    console.log('Update data started');
    return {
        type: UPDATE_DATA_STARTED
    }
}

function updateDataSuccess(){
    console.log('Update data success');
    return {
        type: UPDATE_DATA_SUCCESS
    }
}

function updateDataFailure(obj){
    console.log('Update data failure');
    console.log(obj.error);
    return {
        type: UPDATE_DATA_FAILURE,
        payload: obj.error
    }
}
