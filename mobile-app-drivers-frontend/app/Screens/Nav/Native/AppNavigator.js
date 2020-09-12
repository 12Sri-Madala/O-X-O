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
} from "react-navigation";
import React from "react";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialCommunityIcons
} from "@expo/vector-icons";

// Import Style Guide
import { Colors, Font, Spacing } from "../../Library/Native/StyleGuide";

// // Import login components
import WelcomeScreen from "../../Login/Native/WelcomeScreen";
import PhoneVerification from "../../Login/Native/PhoneVerification";
import CodeVerification from "../../Login/Native/CodeVerification";
import NewUser from "../../Login/Native/NewUser";
import ProfileImage from "../../Login/Native/ProfileImage";
import DrivingInfo from "../../Login/Native/DrivingInfo";
import Loading from "../../Login/Native/Loading";

// Import tab components
import Dashboard from "../../Dash/Native/Dashboard";
import LiveMatch from "../../Live/Native/LiveMatch";
import Payment from "../../Payments/Native/Payment";
import FAQ from "../../FAQ/Native/FAQ";
import GroupChannel from "../../Chat/screens/GroupChannel";
import Chat from "../../Chat/screens/Chat";

import ProfilePage from "../../Profile/Native/ProfilePage";
import EditProfileFieldScreen from "../../Profile/Native/EditProfileField";

import NewCardPage from "../../Payments/Native/NewCardPage";
import EditPayment from "../../Payments/Native/EditPayment";

import withErrorHandling from "../../../Containers/Native/withErrorHandling";

// Errors
import GenericError from "../../Error/Native/GenericError";
import UnauthorizedError from "../../Error/Native/UnauthorizedError";

// Waitlist
import WaitlistPage from "../../Waitlist/Native/WaitlistPage"; /*
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
}) */ /*
Create a stack navigator for the login process.  Will be skipped if the
user is already logged in
*/

/*
Both these are commented out in ProfilePage but are saved here in case we want to add them back in
(see NewCardPage in tabNavigator to see how we can add pages to the navigator but not display them)
*/

// Import local components
// import DrawerContainer from './DrawerContainer';
/*
Create the drawer navigator which contains everything after the login process.
Most of these components will appear in the sidebar menu (see DrawerContainer)
and the remainder are linked to from pages contained in the sidebar
*/ const LoginStack = createStackNavigator(
  {
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: { header: null }
    },
    PhoneVerification: {
      screen: PhoneVerification,
      navigationOptions: { header: null }
    },
    CodeVerification: {
      screen: CodeVerification,
      navigationOptions: { header: null }
    },
    NewUser: { screen: NewUser, navigationOptions: { header: null } },
    ProfileImage: { screen: ProfileImage, navigationOptions: { header: null } },
    DrivingInfo: { screen: DrivingInfo, navigationOptions: { header: null } },
    Loading: { screen: Loading, navigationOptions: { header: null } }
  },
  {
    initialRouteName: "Loading"
  }
);

const PaymentNavigator = createStackNavigator(
  {
    Payment: { screen: Payment, navigationOptions: { header: null } },
    NewCardPage: { screen: NewCardPage, navigationOptions: { header: null } },
    EditPayment: { screen: EditPayment, navigationOptions: { header: null } }
  },
  {
    initialRouteName: "Payment"
  }
);

const DashNavigator = createStackNavigator(
  {
    Dashboard: { screen: Dashboard, navigationOptions: { header: null } },
    Channels: { screen: GroupChannel, navigationOptions: { header: null } },
    Chat: { screen: Chat, navigationOptions: { header: null } }
  },
  {
    initialRouteName: "Dashboard"
  }
);

const ErrorStack = createStackNavigator(
  {
    GenericError: { screen: GenericError, navigationOptions: { header: null } },
    UnauthorizedError: {
      screen: UnauthorizedError,
      navigationOptions: { header: null }
    }
  },
  {
    initialRouteName: "GenericError"
  }
);

const ProfileNavigator = createStackNavigator(
  {
    ProfilePage: { screen: ProfilePage, navigationOptions: { header: null } },
    EditProfileFieldScreen: {
      screen: EditProfileFieldScreen,
      navigationOptions: { header: null }
    }
  },
  {
    initialRouteName: "ProfilePage"
  }
);

/*
Chose the first page to show
Exclude a page from being shown in navigator
Icons in navigator
Color of symbols (wifi, battery, etc.) so that they show against our white background
*/
const TabNavigator = createBottomTabNavigator(
  {
    Payment: {
      screen: PaymentNavigator,
      navigationOptions: {
        title: "EARN",
        tabBarLabel: "EARN",
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          navigation.navigate("Payment");
          defaultHandler();
        }
      }
    }, // style and get rid of stack nav header
    Live: {
      screen: LiveMatch,
      navigationOptions: {
        title: "TODAY",
        tabBarLabel: "TODAY"
      }
    }, // implement
    Dashboard: {
      screen: DashNavigator,
      navigationOptions: {
        title: "PLAN",
        tabBarLabel: "PLAN",
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          navigation.navigate("Dashboard");
          defaultHandler();
        }
      }
    }, // adjust proportions and make sure the function that was used to adjust header title is no longer being called
    ProfileNavigator: {
      screen: ProfileNavigator,
      navigationOptions: {
        title: "PROFILE",
        tabBarLabel: "PROFILE",
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          navigation.navigate("ProfilePage");
          defaultHandler();
        }
      }
    }, // Title / Image spacing
    FAQ: {
      screen: FAQ,
      navigationOptions: {
        title: "HELP",
        tabBarLabel: "HELP"
      }
    } // title centering and spacing
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Payment") {
          iconName = "dollar";
          return <FontAwesome name={iconName} size={25} color={tintColor} />;
        }
        if (routeName === "Live") {
          iconName = "md-sunny";
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        }
        if (routeName === "Dashboard") {
          iconName = "ios-calendar";
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        }
        if (routeName === "ProfilePage") {
          iconName = "md-person";
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        }
        iconName = "comment-question-outline";
        return (
          <MaterialCommunityIcons name={iconName} size={25} color={tintColor} />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: Colors.primary,
      inactiveTintColor: "gray",
      style: {
        marginTop: Spacing.tiny,
        shadowColor: "transparent",
        borderTopWidth: 0
      }
    },
    animationEnabled: false,
    swipeEnabled: false
  },
  {
    initialRouteName: "Dashboard"
  }
);

const MainNavigator = createStackNavigator(
  {
    TabNavigator: { screen: TabNavigator },
    Waitlist: { screen: WaitlistPage }
  },
  {
    mode: "modal",
    headerMode: "none",
    initialRouteName: "TabNavigator"
  }
);

/*
  Create a switch navigator for LoginStack and DrawerNavigator to prevent
  using Android back button to go back to the Login Stack once logged in.
  */
const PrimaryNavigation = createSwitchNavigator(
  {
    LoginStack: { screen: LoginStack },
    MainNavigator: { screen: MainNavigator },
    ErrorStack: { screen: ErrorStack }
  },
  {
    initialRouteName: "LoginStack"
  }
);

export default PrimaryNavigation;
