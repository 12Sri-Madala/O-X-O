import {
  TEST,
  UPDATE_DATA_STARTED,
  UPDATE_DATA_SUCCESS,
  UPDATE_DATA_FAILURE
} from './types';

const initialState = {
  items: [],
  item: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TEST:
      return {
        ...state,
      };
    case UPDATE_DATA_STARTED:
			return {
				...state
			}
		case UPDATE_DATA_SUCCESS:
			return {
				...state
			}
		case UPDATE_DATA_FAILURE:
			return {
				...state,
				error: action.payload
			}
    default:
      return state;
  }
}
