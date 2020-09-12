import {
  SAVE_IMAGE_STARTED,
  SAVE_IMAGE_SUCCESS,
  SAVE_IMAGE_FAILURE,
  LOAD_PROFILE_STARTED,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_FAILURE,
  PROFILE_CHANGE_SUCCESS,
  PROFILE_CHANGE_FAILURE,
  FETCH_WAITLIST_SUCCESS,
  FETCH_WAITLIST_FAILURE
} from './types';

const initialState = {
  loadingImage: false,
  profile: null,
  loadingProfile: null,
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
    case SAVE_IMAGE_STARTED:
      return {
        ...state,
        loadingImage: true,
      }
    case SAVE_IMAGE_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          profileImage: action.payload
        },
        loadingImage: false,
      }
    case SAVE_IMAGE_FAILURE:
      return {
        ...state,
        loadingImage: false,
      }
      case LOAD_PROFILE_STARTED:
      return {
        ...state,
        loadingProfile: true,
      }
    case LOAD_PROFILE_SUCCESS:
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

    default:
      return state;
  }
}
