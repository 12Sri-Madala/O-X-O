import {
  FETCH_CONNECTION_STARTED,
  FETCH_CONNECTION_SUCCESS,
  FETCH_CONNECTION_FAILURE,
  UPDATE_CONNECTION_STATUS_STARTED,
  UPDATE_CONNECTION_STATUS_SUCCESS,
  UPDATE_CONNECTION_STATUS_FAILURE
} from "./types";

import serverInfo from "../../../Resources/serverInfo";

import { updateConnAndMatchStatusDashSuccess } from "../../Dash/Redux/actions";

export function updateConnectionAndMatch(
  userId,
  token,
  connectionID,
  connectionStatus,
  matchStatus
) {
  return dispatch => {
    dispatch(updateConnectionStarted());
    try {
      fetch(`${serverInfo.name}/connection/updateConnectionStatus/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          connectionStatus,
          connectionID,
          matchStatus,
          id: userId,
          token
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.success) {
            if (responseJson.payload.driverMatch) {
              dispatch(updateConnAndMatchStatusDashSuccess(responseJson, 0));
            }
            dispatch(
              updateTodayConnectionSuccess(responseJson.payload.connection)
            );
          } else {
            dispatch(updateConnectionFailure(responseJson));
          }
        })
        .catch(error => dispatch(updateConnectionFailure({ error })));
    } catch (error) {
      dispatch(updateConnectionFailure({ error }));
    }
  };
}

function updateConnectionStarted() {
  return {
    type: UPDATE_CONNECTION_STATUS_STARTED
  };
}

function updateTodayConnectionSuccess(connection) {
  return {
    type: UPDATE_CONNECTION_STATUS_SUCCESS,
    payload: connection
  };
}

export function cancelTodayConnectionSuccess(connection) {
  return {
    type: UPDATE_CONNECTION_STATUS_SUCCESS,
    payload: connection
  };
}

function updateConnectionFailure(error) {
  return {
    type: UPDATE_CONNECTION_STATUS_FAILURE,
    payload: error
  };
}

export function fetchConnection(id, token) {
  return dispatch => {
    dispatch(fetchConnectionStarted());
    try {
      fetch(`${serverInfo.name}/connection/getActiveConnection/${id}/${token}`)
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (!responseJson.success) {
            console.log("Error:", responseJson.error);
            dispatch(fetchConnectionFailure(responseJson.error));
            return;
          }
          dispatch(fetchConnectionSuccess(responseJson.data));
          // Handle Connection Data
        });
    } catch (error) {
      console.log(error);
      dispatch(fetchConnectionFailure(error));
    }
  };
}

function fetchConnectionStarted() {
  return {
    type: FETCH_CONNECTION_STARTED
  };
}

function fetchConnectionSuccess(payload, unread) {
  return {
    type: FETCH_CONNECTION_SUCCESS,
    payload
  };
}

function fetchConnectionFailure(error) {
  return {
    type: FETCH_CONNECTION_FAILURE,
    payload: error
  };
}
