import {
  LOAD_PROFILE_STARTED,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_FAILURE,
  SAVE_IMAGE_STARTED,
  SAVE_IMAGE_SUCCESS,
  SAVE_IMAGE_FAILURE,
  SAVE_CHECKR_STARTED,
  SAVE_CHECKR_SUCCESS,
  SAVE_CHECKR_FAILURE,
  PROFILE_CHANGE_SUCCESS,
  PROFILE_CHANGE_FAILURE,
  FETCH_WAITLIST_SUCCESS,
  FETCH_WAITLIST_FAILURE
}from './types';



import serverInfo from '../../../Resources/serverInfo';


export function fetchWaitlist(id, token){
    return (dispatch) => {
      try {
        fetch(`${serverInfo.name}/waitlist/${id}/${token}`)
        .then(response => response.json())
        .then(responseJson => {
          if(!responseJson.success){
            dispatch(fetchWaitlistFailure())
          }
          if(responseJson.waitlistEntry){
            let waitlist = {
              ...responseJson.waitlistEntry,
              percentile: responseJson.percentile,
              userActions: responseJson.userActions,
            }
            dispatch(fetchWaitlistSuccess(waitlist));
          }
        })
      } catch(error){
        dispatch(fetchWaitlistFailure(error))
      }
    }
  }

function fetchWaitlistSuccess(payload){
  return {
    type: FETCH_WAITLIST_SUCCESS,
    payload: payload,
  }
}

function fetchWaitlistFailure(err){
  return {
    type: FETCH_WAITLIST_FAILURE,
    payload: err,
  }
}

export function saveProfileChange(update, id, token){
  return (dispatch) => {
    try {
      console.log('Passing in');
      console.log(update);
      fetch(`${serverInfo.name}/profile/update`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          update,
          id,
          token,
        }),
      })
        .then(response => response.json())
        .then((responseJson) => {
          if (responseJson.success) {
            dispatch(saveProfileChangeSuccess(responseJson.profile));
          } else {
            dispatch(saveProfileChangeFailure(responseJson.error));
          }
        });
    } catch (error) {
      dispatch(saveProfileChangeFailure(error));
    }
  };
}

function saveProfileChangeSuccess(payload) {
  return {
    payload,
    type: PROFILE_CHANGE_SUCCESS,
  };
}

function saveProfileChangeFailure(error) {
  return {
    error,
    type: PROFILE_CHANGE_FAILURE,
  };
}

export function saveProfileImage(req) {
  return (dispatch) => {
    dispatch(saveImageStarted());
    const payload = JSON.stringify(req);
    try {
      fetch(`${serverInfo.name}/login/saveProfileImage`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: payload,
      })
        .then(response => response.json())
        .then((responseJson) => {
          if (responseJson.success) {
            dispatch(saveImageSuccess(req.payload.base64));
          } else {
            dispatch(saveImageFailure());
          }
        });
    } catch (error) {
      console.log(error);
      dispatch(saveImageFailure());
    }
  };
}

function saveImageStarted() {
  return {
    type: SAVE_IMAGE_STARTED,
  };
}

function saveImageSuccess(image) {
  return {
    type: SAVE_IMAGE_SUCCESS,
    payload: image,
  };
}

function saveImageFailure() {
  return {
    type: SAVE_IMAGE_FAILURE,
  };
}

export function loadProfile(id, token) {
  return async (dispatch) => {
    try {
      dispatch(loadProfileStarted());
      fetch(`${serverInfo.name}/profile/${id}/${token}`)
        .then(response => response.json())
        .then((responseJson) => {
          if (responseJson.success) {
            console.log(responseJson.profile);
            dispatch(loadProfileSuccess(responseJson.profile));
          } else {
            dispatch(loadProfileFailure(responseJson));
          }
        });
    } catch (error) {
      console.log(error);
      dispatch(loadProfileFailure(error));
    }
  };
}

function loadProfileStarted() {
  return {
    type: LOAD_PROFILE_STARTED,
  };
}

function loadProfileSuccess(res) {
  return {
    type: LOAD_PROFILE_SUCCESS,
    payload: res,
  };
}

function loadProfileFailure(res) {
  return {
    type: LOAD_PROFILE_FAILURE,
    payload: res,
  };
}

export function saveCheckr(id, token){
    return async (dispatch) => {
        dispatch(saveCheckrStarted());
        try {
            const response = await fetch(`${serverInfo.name}/checkr/loadCheckrStatus/${id}/${token}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: "GET"
            });
            // Parse the response so you can access the fields in it
            const updatedCheckr = await response.json();
            // console.log(updatedCheckr);
            dispatch(saveCheckrSuccess(updatedCheckr));
          //  await storeItem("checkr", updatedCheckr.checkr);
            return updatedCheckr;
        } catch(error) {
            console.log(error)
            dispatch(saveCheckrFailure(error));
            return null;
        }
    }
}

function saveCheckrStarted() {
  return {
    type: SAVE_CHECKR_STARTED,
  };
}

function saveCheckrSuccess(checkr) {
  return {
    type: SAVE_CHECKR_SUCCESS,
    payload: {
      checkr: checkr.checkr,
    },
  };
}

function saveCheckrFailure(error) {
  return {
    type: SAVE_CHECKR_FAILURE,
    payload: {
      error,
    },
  };
}
