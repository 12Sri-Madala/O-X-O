import { combineReducers } from 'redux';

import LoginReducer from '../../Login/Redux/LoginReducer.js';
import DashReducer from '../../Dash/Redux/DashReducer.js';
import NavReducer from '../../Nav/Redux/NavReducer.js';
import groupChannelReducer from '../../Chat/reducers/groupChannelReducer.js';
import chatReducer from '../../Chat/reducers/chatReducer.js';
import containerReducer from '../../../Containers/Redux/containerReducer.js';
import LiveReducer from '../../Live/Redux/LiveMatchReducer';
import AddressesReducer from '../../Profile/Addresses/Redux/AddressesReducer';
import VehiclesReducer from "../../Profile/Vehicles/Redux/VehiclesReducer";
import ProfileReducer from "../../Profile/Redux/ProfileReducer";
import waitlistReducer from '../../Waitlist/Redux/waitlistReducer';

// Add Reducer from each mini app
 const appReducer = combineReducers({
    login: LoginReducer,
    dash: DashReducer,
    profile: ProfileReducer,
    nav: NavReducer,
    groupChannel: groupChannelReducer,
    chat: chatReducer,
    vehicles: VehiclesReducer,
    addresses: AddressesReducer,
    containers: containerReducer,
    live: LiveReducer,
    waitlist: waitlistReducer,
});


export default rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}
