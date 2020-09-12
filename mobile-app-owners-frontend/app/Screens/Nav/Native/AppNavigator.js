/*
Handle navigation for the entire app.  Uses Stack Navigator for login process
and then a Drawer Navigator once you've reached the Dashboard with a Switch Navigator
holding the two to prevent navigating back to the login step once you've logged in
*/

// Import components from React and React Native
import {
  createStackNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from 'react-navigation';
import React from 'react';
import { Ionicons, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

// Import Style Guide
import { Colors, Font, Spacing } from '../../Library/Native/StyleGuide.js';

// // Import login components
import WelcomeScreen from '../../Login/Native/WelcomeScreen.js';
import PhoneVerification from '../../Login/Native/PhoneVerification.js';
import CodeVerification from '../../Login/Native/CodeVerification.js';
import NewUser from '../../Login/Native/NewUser.js';
import ProfileImage from '../../Login/Native/ProfileImage.js';
import AddressesLogin from '../../Login/Native/AddressesLogin.js';
//import DrivingInfo from '../../Login/Native/DrivingInfo.js';
import Loading from '../../Login/Native/Loading.js';
import LocationList from '../../Profile/Addresses/Native/LocationList.js';
import AddLocation from '../../Profile/Addresses/Native/AddLocation.js';
import LocationInfo from '../../Profile/Addresses/Native/LocationInfo.js';




// Import tab components
import Dashboard from '../../Dash/Native/Dashboard.js';
import LiveMatch from '../../Live/Native/LiveMatch.js';
import Payment from '../../Payments/Native/Payment.js';
import FAQ from '../../FAQ/Native/FAQ.js';
import GroupChannel from '../../Chat/screens/GroupChannel.js';
import Chat from '../../Chat/screens/Chat.js';

import VehiclesList from '../../Profile/Vehicles/Native/VehiclesList'

import AddVehicle from '../../Profile/Vehicles/Native/AddVehicle.js';
import VehicleDetails from '../../Profile/Vehicles/Native/VehicleDetails.js';
import VehicleInfo from '../../Profile/Vehicles/Native/VehicleInfo'
import Insurance from '../../Profile/Vehicles/Native/Insurance.js';
import Inspection from '../../Profile/Vehicles/Native/Inspection.js';


// import Settings from '../../ExPages/Native/Settings.js';
// import Messages from '../../ExPages/Native/Messages.js';
import ProfilePage from '../../Profile/Native/ProfilePage.js';
import EditProfileFieldScreen from '../../Profile/Native/EditProfileField';
import StripeOnboarding from '../../Payments/Native/StripeOnboarding';
import StripeDashboard from "../../Payments/Native/StripeDashboard";

//Errors
import GenericError from '../../Error/Native/GenericError';
import UnauthorizedError from '../../Error/Native/UnauthorizedError';

//Waitlist
import WaitlistPage from '../../Waitlist/Native/WaitlistPage';


// Import local components
//import DrawerContainer from './DrawerContainer.js';
/*
Create the drawer navigator which contains everything after the login process.
Most of these components will appear in the sidebar menu (see DrawerContainer)
and the remainder are linked to from pages contained in the sidebar
*//*
const DrawerNavigator = createDrawerNavigator({
Dashboard: { screen: Dashboard },
Payment: { screen: Payment },
Channels: { screen: GroupChannel },
Chat: { screen: Chat},
NewCardPage: { screen: NewCardPage },
FAQ: { screen: FAQ, navigationOptions: {header: null} },
// Settings: { screen: Settings, navigationOptions: {header: null} },
// Messages: { screen: Messages, navigationOptions: {header: null} },
ProfilePage: { screen: ProfilePage, navigationOptions: {header:null} },
EmailCheckr: { screen: EmailCheckr, navigationOptions: {header:null} },
EditBio: { screen: EditBio, navigationOptions: {header:null} },
// LiveMatch: { screen: LiveMatch, navigationOptions: {header:null} },
}, {
contentComponent: DrawerContainer,
})*/

/*
Create a stack navigator for the login process.  Will be skipped if the
user is already logged in
*/
const LoginStack = createStackNavigator({
  WelcomeScreen: { screen: WelcomeScreen, navigationOptions: {header: null} },
  PhoneVerification: { screen: PhoneVerification, navigationOptions: {header: null} },
  CodeVerification: { screen: CodeVerification, navigationOptions: {header: null} },
  NewUser: { screen: NewUser, navigationOptions: {header: null} },
  ProfileImage: { screen: ProfileImage, navigationOptions: {header:null} },
  AddressesLogin: { screen: AddressesLogin, navigationOptions: {header:null} },
  //DrivingInfo: { screen: DrivingInfo, navigationOptions: {header:null} },
  Loading: { screen: Loading, navigationOptions: {header:null} },
},
{
  initialRouteName: 'Loading',
},
);

const PaymentNavigator = createStackNavigator(
  {
    Payment: { screen: Payment, navigationOptions: {header: null} },

    StripeOnboarding: { screen: StripeOnboarding, navigationOptions: {header: null} },
    StripeDashboard: { screen: StripeDashboard, navigationOptions: {header: null} }
  },
  {
    initialRouteName: 'Payment'
  }
);

const DashNavigator = createStackNavigator(
  {
    Dashboard: { screen: Dashboard, navigationOptions: {header: null} },
    Channels: { screen: GroupChannel, navigationOptions: {header: null} },
    Chat: { screen: Chat, navigationOptions: {header: null} },

  },
  {
    initialRouteName: 'Dashboard'
  }
);

const ProfileNavigator = createStackNavigator(
    {
        ProfilePage: { screen: ProfilePage, navigationOptions: {header: null} },
        EditProfileFieldScreen: { screen: EditProfileFieldScreen, navigationOptions: {header: null}},
        LocationList: { screen: LocationList, navigationOptions: {header: null} },
        AddLocation: { screen:AddLocation, navigationOptions: {header: null} },
        LocationInfo: { screen:LocationInfo, navigationOptions: {header: null} },
        VehiclesList: { screen: VehiclesList, navigationOptions: {header: null} },
        VehicleInfo: { screen: VehicleInfo, navigationOptions: {header: null} },
        AddVehicle: { screen: AddVehicle, navigationOptions: {header: null} },
        VehicleDetails: { screen: VehicleDetails, navigationOptions: {header: null} },
        Insurance: { screen: Insurance, navigationOptions: {header: null} },
        Inspection: { screen: Inspection, navigationOptions: {header: null} },
    },
    {
        initialRouteName: 'ProfilePage'
    }
);

const ErrorStack = createStackNavigator({
  GenericError: { screen: GenericError, navigationOptions: {header: null} },
  UnauthorizedError: { screen: UnauthorizedError, navigationOptions: {header: null} },
},
{
  initialRouteName: 'GenericError',
},
);

/*
Chose the first page to show
Exclude a page from being shown in navigator
Icons in navigator
Color of symbols (wifi, battery, etc.) so that they show against our white background
*/
const TabNavigator = createBottomTabNavigator({
  Payment: { screen: PaymentNavigator, navigationOptions: {title: "EARN"}}, // style and get rid of stack nav header
  Live: { screen: LiveMatch, navigationOptions: {title: "TODAY"}}, // implement
  Dashboard: { screen: DashNavigator, navigationOptions: {title: "PLAN"}}, // adjust proportions and make sure the function that was used to adjust header title is no longer being called
  ProfilePage: { screen: ProfileNavigator, navigationOptions: {title: "PROFILE"}}, // Title / Image spacing
  FAQ: { screen: FAQ, navigationOptions: {title: "HELP"}}, // title centering and spacing
},
{
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Payment') {
        iconName = "dollar";
        return <FontAwesome name={iconName} size={25} color={tintColor} />;
      } else if (routeName === 'Live') {
        iconName = "md-sunny";
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      } else if (routeName === 'Dashboard') {
        iconName = "ios-calendar";
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      } else if (routeName === 'ProfilePage') {
        iconName = "md-person";
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      } else {
        iconName = "comment-question-outline";
        return <MaterialCommunityIcons name={iconName} size={25} color={tintColor} />;
      }
    },
  }),
  tabBarOptions: {
    activeTintColor: Colors.primary,
    inactiveTintColor: 'gray',
    style: {
      marginTop: Spacing.tiny,
      shadowColor: 'transparent',
      borderTopWidth: 0,
    },
    },
    animationEnabled: false,
    swipeEnabled: false,
  },
  {
    initialRouteName: 'Dashboard'
  });

DashNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
    };
};

PaymentNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
    };
};

ProfileNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
    };
};

const MainNavigator = createStackNavigator({
  TabNavigator: { screen: TabNavigator },
  Waitlist: { screen: WaitlistPage },
}, {
  mode: 'modal',
  headerMode: 'none',
  initialRouteName: 'TabNavigator',
});

/*
Create a switch navigator for LoginStack and DrawerNavigator to prevent
using Android back button to go back to the Login Stack once logged in.
*/
  const PrimaryNavigation = createSwitchNavigator(
    {
      LoginStack: { screen: LoginStack },
      MainNavigator: { screen: MainNavigator },
      ErrorStack: {screen: ErrorStack }
    },
    {
      initialRouteName: 'LoginStack',
    }
  );

  export default PrimaryNavigation
