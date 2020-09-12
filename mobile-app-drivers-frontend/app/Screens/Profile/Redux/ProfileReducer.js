import {
  SAVE_CHECKR_FAILURE,
  SAVE_CHECKR_SUCCESS,
  SAVE_CHECKR_STARTED,
  LOAD_PROFILE_STARTED,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_FAILURE,
  SAVE_IMAGE_STARTED,
  SAVE_IMAGE_SUCCESS,
  SAVE_IMAGE_FAILURE,
  PROFILE_CHANGE_SUCCESS,
  PROFILE_CHANGE_FAILURE,
  FETCH_WAITLIST_SUCCESS, 
  FETCH_WAITLIST_FAILURE
  } from './types';

const initialState = {
  loadingProfile: true,
  loadingImage: false,
  profile: null,
  error: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_CHANGE_SUCCESS:
      return {
        ...state,
        profile: action.payload,
      }
    case PROFILE_CHANGE_FAILURE:
    return {
      ...state,
      error: action.error
    }
    case FETCH_WAITLIST_SUCCESS:
      return {
        ...state,
        waitlist: action.payload
      };
    case FETCH_WAITLIST_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case LOAD_PROFILE_STARTED:
      return {
        ...state,
        loadingProfile: true,
      }
    case LOAD_PROFILE_SUCCESS:
      console.log('Getting into load profile success');
      console.log(action.payload);
      return {
        ...state,
        profile: action.payload,
        loadingProfile: false,
      }
    case LOAD_PROFILE_FAILURE:
      return {
        ...state,
        loadingProfile: false,
      };

    case SAVE_IMAGE_STARTED:
      return {
        ...state,
        loadingImage: true,
      };
    case SAVE_IMAGE_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          profileImage: action.payload
        },
        loadingImage: false,
      };
    case SAVE_IMAGE_FAILURE:
      return {
        ...state,
        loadingImage: false,
      }
      case SAVE_CHECKR_FAILURE:
        return {
          ...state,
          error: action.payload.error
        };

      case SAVE_CHECKR_STARTED:
      return{
        ...state,
      };

      case SAVE_CHECKR_SUCCESS:
      return{
        ...state,
        checkr: action.payload.checkr
    };

  default:
        return state;
  }
}
