import {
  SET_WAITLIST_OPENED,
  PROFILE_CHANGE_SUCCESS,
  PROFILE_CHANGE_FAILURE,
} from './types.js';

const initialState = {
  opened: false,
  profile: null,
  error: null,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case SET_WAITLIST_OPENED:
			return {
				...state,
				opened: true
      };
    case PROFILE_CHANGE_SUCCESS:
    console.log('Getting into profile change success');
    return {
      ...state,
      profile: action.payload,
    }
    case PROFILE_CHANGE_FAILURE:
    return {
      ...state,
      error: action.error
    }
		default:
			return state;
	}
};

