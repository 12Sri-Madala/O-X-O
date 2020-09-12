import {
  LOAD_DRIVER_MATCHES,
  LOAD_OWNER_MATCHES,
  MATCH_ERROR
} from "./actionTypes";

//Passing the token through could be something to remove in the future.

export function loadDriverMatches(date: Date, token: string) {
  return (dispatch: any) => {
    fetch(`/matches/matchlist/driver/${date}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          dispatch({
            type: LOAD_DRIVER_MATCHES,
            payload: responseJson.matches
          });
        }
      });
  };
}

export function loadOwnerMatches(date: Date, token: string) {
  return (dispatch: any) => {
    fetch(`/matches/matchlist/owner/${date}`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          dispatch({
            type: LOAD_OWNER_MATCHES,
            payload: responseJson.matches
          });
        }
      });
  };
}

export function makeConnection(
  driverMatchID: string,
  ownerMatchID: string,
  date: Date,
  token: string
) {
  return async (dispatch: any) => {
    const response = await fetch("/connection", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        driverMatchID,
        ownerMatchID
      })
    });
    const responseJson = await response.json();
    if (!responseJson.success) {
      dispatch({
        type: MATCH_ERROR,
        payload: responseJson.errorMessage
      });
    }
  };
}
