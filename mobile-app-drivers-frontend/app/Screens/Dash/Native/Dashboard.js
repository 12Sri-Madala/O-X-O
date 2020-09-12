/*
If the user has passed their background check, this renders the dashboard swiper and calendar
and populates it with EditAvailability or Match Found screens depending on the status of
each day.
*/

/*
TO DO:
- Dashboard
- Calendar Header
- Initial position on Android
- Dot size and position
- Idk how to make it not disappear when it's top goes beyond the height of the View
- Make sure only 7 days can fit on the screen at a time
- Stop double clutch when days are hit rapidly in succession
- Use content offset for initial position instead of manually scrolling
- And use Platform.select plus getDat to choose the initial position
- EditAvailability
- Color scheme on unavailable page
- Make sure new switch looks ok on android
- Decompose
- Put header in flex view
- MatchFound
- Put header in flex view
- Find out why street works better than the full address
- Where to go when car or owner are clicked
- Get owner profile pic from base 64
- General
- Alert whenever any database or server calls fail
- Comment
- Replace everything I can with StyleGuide terms
- Make sure everything's background is Colors.white
- Move any hard coded strings into language guide
- shouldComponentUpdate() to fix excess renders
- Eliminate arrow functions in render using binders in the constructor (especially in mapped components)
- Error checking with server down, datbase down, etc.
- Maybe new class from textIcon function in MatchFoundHelpers
- Other
- Look at react-native-material source code for expandable button with min size and minimal re-rendering
- Database on Amazon RDS
- Color scheme
- Post merge
- Rearrange database to have an id, token, and phone number
- alter everything else accordingly
- get twilio phone number for the match
*/

// Import components from React and React Native
import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import { NavigationEvents } from "react-navigation";
import withErrorHandling from "../../../Containers/Native/withErrorHandling";

// Import local components
import MatchFound from "./MatchFound";
import EditAvailability from "./EditAvailability";
import CalendarHeader from "./CalendarHeader";

// Import library components
import Header from "../../Library/Native/Header";
import Loader from "../../Library/Native/Loader";
import { Colors } from "../../Library/Native/StyleGuide";

// Import Redux Actions
import {
  fetchData,
  swiperChange,
  chatSuccess,
  fetchWaitlist
} from "../Redux/actions";
import { Dash } from "../../Library/Native/LanguageGuide";
import { sbGetChannelTitle } from "../../Chat/sendbirdActions";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first: true,
      id: null,
      token: null
    };
  }

  async componentDidMount() {
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
    if (id === null) {
      AsyncStorage.removeItem("token");
      this.props.navigation.navigate("WelcomeScreen");
    }
    this.setState({ id, token });
    this.props.dispatchFetchData(id, token);
    if (!this.props.waitlistOpened) {
      this.props.dispatchFetchWaitlist(id, token);
    }
  }

  componentDidUpdate() {
    this.handleReRoutes(); // May want to remove
    if (this.props.channel) {
      this.props.dispatchChatSuccess();
      this.props.navigation.navigate("Chat", {
        channelUrl: this.props.channel.url,
        title: sbGetChannelTitle(this.props.channel),
        memberCount: this.props.channel.memberCount,
        isOpenChannel: this.props.channel.isOpenChannel()
      });
    }
  }

  /**
   * [handleReRoutes handles and specific reroutes that should be taken from dashboard]
   * @method handleReRoutes
   */
  handleReRoutes() {
    const { waitlist, waitlistOpened, navigation } = this.props;
    if (waitlist && !waitlistOpened) {
      navigation.navigate("Waitlist");
    }
  }

  /*
  Description: Determines which screen should be displayed on the swiper page
  Arguments: day - match object (as seen in matchesDB) containing data for the day to be displayed
  Returns: JSX code specifing the component to be displayed
  */
  determineContent(match, index) {
    switch (match.status) {
      case "Complete":
      case "Live":
      case "Confirmed":
      case "Matched":
        return (
          <MatchFound
            index={index}
            navigate={loc => this.props.navigation.navigate(loc)}
          />
        );
      case "Available":
      case "Unavailable":
        return <EditAvailability index={index} />;
      default:
        return match.status;
    }
  }

  /*
  Description: Maps every day in the matches array (from matchesDB) to a screen
  Arguments: N/A
  Returns: Array of 14 screens
  */
  populateScrollView() {
    return this.props.matches.map((match, index) => (
      <View style={styles.page} key={match.date}>
        {this.determineContent(match, index)}
      </View>
    ));
  }

  handleScroll(event) {
    if (
      event.nativeEvent.contentOffset.x / Dimensions.get("window").width !==
      this.props.selected
    ) {
      this.props.dispatchSwiperChange(
        Math.round(
          event.nativeEvent.contentOffset.x / Dimensions.get("window").width
        )
      );
    }
  }

  render() {
    if (this.props.matches) {
      return (
        <View style={styles.container}>
          {this.state.id && this.state.token && (
            <NavigationEvents
              onWillFocus={payload =>
                this.props.dispatchFetchData(this.state.id, this.state.token)
              }
            />
          )}
          <View style={styles.headers}>
            <Header
              icon="message"
              title="Your plan"
              unread={this.props.unread}
              _callback={() => {
                this.props.navigation.navigate("Channels");
              }}
              _call={() => {
                this.props.dispatchSwiperChange(0);
                this.ScrollView.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true
                });
                this.props.navigation.navigate("Dashboard");
              }}
            />
            <CalendarHeader
              scroll={index => {
                this.ScrollView.scrollTo({
                  x: index * Dimensions.get("window").width,
                  y: 0,
                  animated: true
                });
              }}
            />
          </View>

          <View style={styles.swiperContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              onMomentumScrollEnd={event => this.handleScroll(event)}
              ref={ref => (this.ScrollView = ref)}
            >
              {this.populateScrollView()}
            </ScrollView>
          </View>
        </View>
      );
    }
    return <Loader loading={this.props.loading} />;
  }
}

const mapStateToProps = state => {
  return {
    loading: state.dash.loading,
    matches: state.dash.matches,
    error: state.dash.error,
    selected: state.dash.selected,
    channel: state.dash.channel,
    unread: state.dash.unread,
    waitlist: state.dash.waitlist,
    waitlistOpened: state.waitlist.opened
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchFetchData: (id, token) => dispatch(fetchData(id, token)),
    dispatchSwiperChange: index => dispatch(swiperChange(index)),
    dispatchChatSuccess: () => dispatch(chatSuccess()),
    dispatchFetchWaitlist: (id, token) => dispatch(fetchWaitlist(id, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandling(Dashboard));

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: "100%",
    backgroundColor: Colors.white
  },
  swiperContainer: {
    flex: 2
  },
  page: {
    width: Dimensions.get("window").width,
    height: "100%"
  },
  headers: {
    flex: 0.75,
    width: "100%"
  }
});
