import {
    SAVE_VEHICLE_STARTED,
    SAVE_VEHICLE_SUCCESS,
    SAVE_VEHICLE_FAILURE,
    LOAD_VEHICLES_SUCCESS,
    LOAD_VEHICLES_STARTED,
    LOAD_VEHICLES_FAILURE,
    SAVE_LICENSE_SUCCESS,
    SAVE_LICENSE_STARTED,
    SAVE_LICENSE_FAILURE
} from './types';


const initialState = {
  error: null,
  loading: false,
  vehicles: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_VEHICLES_STARTED:
        console.log('GET vehicles started');
        return{
          ...state,
          loading:true
        };
    case LOAD_VEHICLES_SUCCESS:
        console.log('GET vehicles success');
        console.log(action.payload);
        return {
            ...state,
            loading: false,
            vehicles: action.payload
        };
    case LOAD_VEHICLES_FAILURE:
        console.log('Get vehicles failure');
        return{
          ...state,
          loading:false,
        }
    case SAVE_VEHICLE_STARTED:
        return{
          ...state,
      };
    case SAVE_VEHICLE_SUCCESS:
      let temp = JSON.parse(JSON.stringify(state.vehicles));
      temp[action.index] = action.payload;
      return {
        ...state,
        vehicles: temp
      };
    case SAVE_VEHICLE_FAILURE:
      return {
        ...state,
      };
      case SAVE_LICENSE_STARTED:
          return{
            ...state,
        };
    case SAVE_LICENSE_SUCCESS:
      temp= JSON.parse(JSON.stringify(state.vehicles));
      temp[action.index] = action.payload;
        return {
          ...state,
          vehicles: temp
          };
    case SAVE_LICENSE_FAILURE:
        return{
          ...state,
            };
      default:
      return state;
  }

}
