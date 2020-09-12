import {
  SAVE_PHONE,
  SEND_CODE_STARTED,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAILURE,
  VERIFY_CODE_STARTED,
  VERIFY_CODE_SUCCESS,
  VERIFY_CODE_FAILURE,
  SAVE_USER_STARTED,
  SAVE_USER_SUCCESS,
  SAVE_USER_FAILURE,
  SAVE_ADDRESS_STARTED,
  SAVE_ADDRESS_SUCCESS,
  SAVE_ADDRESS_FAILURE,
  SAVE_IMAGE_STARTED,
  SAVE_IMAGE_SUCCESS,
  SAVE_IMAGE_FAILURE,
} from './types';

const initialState = {
  phoneInfo: {
    phoneNumber: null,
    countryCode: null,
  },
  name: null,
  phoneLoading: false,
  codeLoading: false,
  nameLoading: false,
  imageLoading: false,
  codeSent: null,
  codeCorrect: null,
  profileImage: null,
  addresses:null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SAVE_PHONE:
      return {
        ...state,
        phoneInfo: action.payload,
      };
    case SEND_CODE_STARTED:
      return {
        ...state,
        phoneLoading: true,
      };
    case SEND_CODE_SUCCESS:
      return {
        ...state,
        phoneLoading: false,
        codeSent: true,
      };
    case SEND_CODE_FAILURE:
      return {
        ...state,
        phoneLoading: false,
        codeSent: false,
      };
    case VERIFY_CODE_STARTED:
      console.log("Started")
      return {
        ...state,
        codeLoading: true,
      };
    case VERIFY_CODE_SUCCESS:
      console.log("Success")
      return {
        ...state,
        codeLoading: false,
        codeCorrect: true,
      };
    case VERIFY_CODE_FAILURE:
      console.log("Failure")
      return {
        ...state,
        codeLoading: false,
        codeCorrect: false,
      };
    case SAVE_USER_STARTED:
      return {
        ...state,
        nameLoading: true,
      };
    case SAVE_USER_SUCCESS:
      return {
        ...state,
        nameLoading: false,
      };
    case SAVE_USER_FAILURE:
      return {
        ...state,
        nameLoading: false,
      };
    case SAVE_IMAGE_STARTED:
      return {
        ...state,
        imageLoading: true,
      };
    case SAVE_IMAGE_SUCCESS:
      return {
        ...state,
        imageLoading: false,
        profileImage: action.payload
      };
    case SAVE_IMAGE_FAILURE:
      return {
        ...state,
        imageLoading: false,
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
