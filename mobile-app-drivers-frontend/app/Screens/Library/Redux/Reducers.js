import { combineReducers } from 'redux';

import LoginReducer from '../../Login/Redux/LoginReducer';
import DashReducer from '../../Dash/Redux/DashReducer';
import PaymentsReducer from '../../Payments/Redux/PaymentsReducer';
import NavReducer from '../../Nav/Redux/NavReducer';
import LibraryReducer from './LibraryReducer';
import groupChannelReducer from '../../Chat/reducers/groupChannelReducer';
import chatReducer from '../../Chat/reducers/chatReducer';
import containerReducer from '../../../Containers/Redux/containerReducer';
import LiveReducer from '../../Live/Redux/LiveMatchReducer';
import ProfileReducer from '../../Profile/Redux/ProfileReducer';
import waitlistReducer from '../../Waitlist/Redux/waitlistReducer';

// Add Reducer from each mini app
 const appReducer = combineReducers({
   login: LoginReducer,
   dash: DashReducer,
   live: LiveReducer,
   payments: PaymentsReducer,
   profile: ProfileReducer,
   nav: NavReducer,
   library: LibraryReducer,
   groupChannel: groupChannelReducer,
   chat: chatReducer,
   containers: containerReducer,
   waitlist: waitlistReducer,
});


export default rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}
