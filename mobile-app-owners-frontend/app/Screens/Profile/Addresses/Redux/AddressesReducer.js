import {  LOAD_ADDRESSES_FAILURE,
  LOAD_ADDRESSES_SUCCESS,
  LOAD_ADDRESSES_STARTED,
  SAVE_ADDRESS_FAILURE,
  SAVE_ADDRESS_SUCCESS,
  SAVE_ADDRESS_STARTED,
}from './types';

const initialState = {
  addresses:{},
  loadingAddresses: true,
  error: null,
};

export default function(state = initialState, action) {
  switch (action.type) {

    case LOAD_ADDRESSES_STARTED:
      return {
        ...state,
      };
    case LOAD_ADDRESSES_SUCCESS:
      return {
        ...state,
        addresses: action.payload.addresses
      };
    case LOAD_ADDRESSES_FAILURE:
      return {
        ...state,
        error: action.payload.error
      };
      case SAVE_ADDRESS_STARTED:
        return {
          ...state,
          addressLoading: true,
        };
      case SAVE_ADDRESS_SUCCESS:
        return {
          ...state,
         addresses: action.payload,
        };
      case SAVE_ADDRESS_FAILURE:
        return {
          ...state,
          addressLoading: false,
        };
      default:
        return state;
    }
  }
