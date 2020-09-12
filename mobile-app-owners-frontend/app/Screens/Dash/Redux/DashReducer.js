import _ from "lodash";
import {
  FETCH_DATA_STARTED,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  FETCH_CONNECTION_STARTED,
  FETCH_CONNECTION_SUCCESS,
  FETCH_CONNECTION_FAILURE,
  CAL_CHANGE,
  SWIPER_CHANGE,
  UPDATE_DATA_SUCCESS,
  UPDATE_DATA_FAILURE,
  UPDATE_DATA_STARTED,
  MESSAGING,
  MESSAGING_FAILURE,
  CHAT_SUCCESS,
  FETCH_WAITLIST_SUCCESS,
  FETCH_WAITLIST_FAILURE,
  UPDATE_CONN_AND_MATCH_STARTED,
  UPDATE_CONN_AND_MATCH_SUCCESS,
  UPDATE_CONN_AND_MATCH_FAILURE
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
  matches: null,
  drivers: null,
  vehicles: null,
  owner: null,
  selected: 0,
  channel: null,
  live: false,
  unread: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_DATA_STARTED:
      const silent =
        state.matches && state.drivers && state.vehicles && state.owner;
      return {
        ...state,
        loading: !silent
      };
    case FETCH_DATA_SUCCESS:
      console.log("Data Fetch Success");
      // console.log(action.payload.data.matches);
      const matchesSorted = _.sortBy(action.payload.data.matches, match => {
        const date = new Date(match.date);
        return date;
      });
      const liveMatch = matchesSorted[0].status === "Live";

      return {
        ...state,
        matches: matchesSorted,
        drivers: action.payload.data.drivers,
        owner: action.payload.data.owner[0],
        vehicles: action.payload.data.vehicles,
        unread: action.unread,
        live: liveMatch,
        loading: false
      };
    case FETCH_DATA_FAILURE:
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        error:
          typeof action.payload === "string"
            ? action.payload
            : "Network Request Failed"
      };
    case FETCH_CONNECTION_STARTED:
      console.log("Fetching connection");
      return {
        ...state,
        loading: true
      };
    case FETCH_CONNECTION_SUCCESS:
      console.log("Connection fetch success");
      return {
        ...state,
        connection: action.payload.connection,
        loading: false
      };
    case FETCH_CONNECTION_FAILURE:
      console.log("Connection fetch failure");
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case FETCH_WAITLIST_SUCCESS:
      console.log("Adding the waitlist to the store");
      return {
        ...state,
        waitlist: action.payload
      };
    case FETCH_WAITLIST_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case CAL_CHANGE:
      return {
        ...state,
        selected: action.payload
      };
    case SWIPER_CHANGE:
      return {
        ...state,
        selected: action.payload
      };
    case UPDATE_DATA_STARTED:
      console.log("Updating data");
      return {
        ...state,
        loading: true
      };
    case UPDATE_DATA_SUCCESS:
      console.log("Update data success");
      const temp = JSON.parse(JSON.stringify(state.matches));
      temp[action.index] = action.payload;
      return {
        ...state,
        loading: false,
        matches: temp
      };
    case UPDATE_DATA_FAILURE:
      console.log("Update data failure");
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case UPDATE_CONN_AND_MATCH_STARTED:
      console.log("Started to cancel connection and match from Dash");
      return {
        ...state,
        loading: true
      };
    case UPDATE_CONN_AND_MATCH_SUCCESS:
      console.log("Cancel connection and match success");
      const tempMatches = JSON.parse(JSON.stringify(state.matches));
      tempMatches[action.index] = action.payload.ownerMatch;
      return {
        ...state,
        loading: false,
        matches: tempMatches
      };
    case UPDATE_CONN_AND_MATCH_FAILURE:
      console.log("Cancel connection or match failure");
      return {
        ...state,
        error:
          typeof action.payload === "string"
            ? action.payload
            : "Network Request Failed",
        loading: false
      };
    case MESSAGING:
      console.log("Messaging");
      return {
        ...state,
        channel: action.payload
      };
    case MESSAGING_FAILURE:
      console.log("Messaging failure");
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case CHAT_SUCCESS:
      console.log("Chat success");
      return {
        ...state,
        channel: null
      };
    default:
      return state;
  }
}
