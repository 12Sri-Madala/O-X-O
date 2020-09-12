import { PROFILE_CHANGE_SUCCESS, PROFILE_CHANGE_FAILURE } from "./types";

import serverInfo from "../../../Resources/serverInfo";

export function saveProfileChange(update, id, token) {
  return dispatch => {
    try {
      console.log("Passing in");
      console.log(update);
      fetch(`${serverInfo.name}/profile/update`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          update,
          id,
          token
        })
      })
        .then(response => response.json())
        .then(responseJson => {
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
    type: PROFILE_CHANGE_SUCCESS
  };
}

function saveProfileChangeFailure(error) {
  return {
    error,
    type: PROFILE_CHANGE_FAILURE
  };
}
