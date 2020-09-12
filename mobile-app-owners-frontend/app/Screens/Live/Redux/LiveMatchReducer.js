import _ from "lodash";
import {
  FETCH_CONNECTION_STARTED,
  FETCH_CONNECTION_SUCCESS,
  FETCH_CONNECTION_FAILURE,
  UPDATE_CONNECTION_STATUS_STARTED,
  UPDATE_CONNECTION_STATUS_SUCCESS,
  UPDATE_CONNECTION_STATUS_FAILURE
} from "./types";

function today() {
  const d = new Date();
  if (d.getDay() == 0) {
    return 6;
  }
  return d.getDay() - 1;
}

const initialState = {
  loading: false,
  error: null,
  connection: null,
  vehicle: null,
  owner: null,
  driver: null,
  live: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CONNECTION_STARTED:
      console.log("Fetching connection");
      return {
        ...state,
        loading: true
      };
    case FETCH_CONNECTION_SUCCESS:
      console.log("Connection fetch success");
      let live = false;
      if (action.payload.connection) {
        live = true;
      }
      return {
        ...state,
        live,
        connection: action.payload.connection,
        owner: action.payload.owner,
        vehicle: action.payload.vehicle,
        driver: action.payload.driver,
        loading: false
      };
    case FETCH_CONNECTION_FAILURE:
      console.log("Connection fetch failure");
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case UPDATE_CONNECTION_STATUS_STARTED:
      console.log("Started to update connection and match from Live");
      return {
        ...state,
        loading: true
      };
    case UPDATE_CONNECTION_STATUS_SUCCESS:
      console.log("update connection status success");
      return {
        ...state,
        connection: action.payload,
        loading: false
      };
    case UPDATE_CONNECTION_STATUS_FAILURE:
      console.log("update connection status failed");
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}
