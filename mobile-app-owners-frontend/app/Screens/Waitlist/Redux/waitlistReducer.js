import {
  SET_WAITLIST_OPENED,
} from './types';


const initialState = {
  opened: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_WAITLIST_OPENED:
      return {
        ...state,
        opened: true,
      };
    default:
      return state;
  }
}
