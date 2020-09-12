import {
  CLEAR_ERROR_SUCCESS,
} from './types.js';

import _ from 'lodash';

const initialState = {
	error: null,
};

export default function(state = initialState, action) {
	switch (action.type) {
    case CLEAR_ERROR_SUCCESS:
      return {
        ...state,
        error: null,
      }
		default:
			return state;
	}
}
