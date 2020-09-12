import {
  LOAD_DRIVER_MATCHES,
  LOAD_OWNER_MATCHES,
  MATCH_ERROR,
  LOAD_OWNERS_INFO,
  LOAD_DRIVERS_INFO
} from "./actionTypes";

const initialState = {
  driverMatches: [{}],
  ownerMatches: [{}],
  driversInfo: {},
  ownersInfo: {}
};

export default function(
  state = initialState,
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    case LOAD_DRIVER_MATCHES:
      return {
        ...state,
        driverMatches: action.payload
      };
    case LOAD_OWNER_MATCHES:
      return {
        ...state,
        ownerMatches: action.payload
      };
    case LOAD_DRIVERS_INFO:
      return {
        ...state,
        driversInfo: action.payload
      };
    case LOAD_OWNERS_INFO:
      return {
        ...state,
        ownersInfo: action.payload
      };
    case MATCH_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}
