// Import components from React and React Native
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  AsyncStorage,
  Alert
} from "react-native";
import MapView, {
  Marker,
  Callout,
  AnimatedRegion,
  Polyline
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { connect } from "react-redux";
import { NavigationEvents } from "react-navigation";

// Import local components
import { Spacing, Font, Colors } from "../../Library/Native/StyleGuide.js";
import { openMaps } from "../../Dash/Native/MatchFoundHelpers.js";
import { fetchConnection } from "../Redux/actions";
import Header from "../../Library/Native/Header";
import CalendarHeader from "../../Dash/Native/CalendarHeader";
import MatchDetails from "./MatchDetails";
import withErrorHandling from "../../../Containers/Native/withErrorHandling";

const Scaledrone = require("scaledrone-react-native");

const drone = new Scaledrone("fjiSVsyCb4xgahBA");

/*
To do:
- Status bubble on top of screen
- Directions button on bottom of screen
- Not "Live"
- set status to "no match today"
- no directions button
- "Live"
- Before
- countdown to match start
- directions to car pickup
- During
- countdown to match end
- directions to car dropoff
- After
- status = match complete
- Style status bar and directions button
- Countdown ticker
- Update marker position with pickup and dropoff locations
- Update openMaps function to handle coordinates
- Test with fabricated data
*/

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DRIVER_DEFAULT_LATITUDE = 40.741895;
const DRIVER_DEFAULT_LONGITUDE = -122.405211;
const CAR_DEFAULT_LATITUDE = 37.801895;
const CAR_DEFAULT_LONGITUDE = -122.4052;
const GOOGLE_MAPS_APIKEY = "AIzaSyCC2nB2SUX1l9Yh33hlj4fGhGH_oFVIZLY";

class LiveMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      driverPosition: {
        // latitude: DRIVER_DEFAULT_LATITUDE,  // replace this with driver address or default HQ
        // longitude: DRIVER_DEFAULT_LONGITUDE, // replace this with driver address or default HQ
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      markerPosition: {
        latitude: CAR_DEFAULT_LATITUDE, // replace this with car pickup/dropoff location
        longitude: CAR_DEFAULT_LONGITUDE, // replace this with car pickup/dropoff location
        address: " "
      },
      id: null,
      token: null,
      error: null,
      matchIndex: null
    };

    this.carLocation = this.carLocation.bind(this);
  }

  async componentDidMount() {
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
    this.props.dispatchFetchConnection(id, token);
    this.setState({
      id,
      token
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.connection) {
      const room = drone.subscribe(
        `${this.props.connection.id}_${this.props.connection.driverID}`
      );
      room.on("open", error => {
        if (error) {
          return console.error(error);
        }
        console.log("Connected to room");
        // Connected to room
      });
      room.on("message", message => {
        console.log("Received message");
        console.log(message.data);
        const partnerLocation = message.data;
        this.setState({ partnerLocation });
      });
    }
  }

  getPartnerLocation() {
    if (this.state.partnerLocation) {
      return (
        <Marker
          ref={marker => {
            this.partnerMarker = marker;
          }}
          pinColor={Colors.secondary}
          coordinate={this.state.partnerLocation}
        />
      );
    }
    return null;
  }

  today() {
    const d = new Date();
    return d.toDateString();
  }

  headerContent() {
    if (
      this.props.connection == null ||
      this.props.connection.status === "CANCELED"
    ) {
      return "No matches today";
    }
    if (this.props.connection.status === "CONFIRMED") {
      return "Go meet your match!";
    }
    if (this.props.connection.status === "LIVE") {
      return "Your driver will meet you back here later";
    }
    if (this.props.connection.status === "COMPLETE") {
      return "All set! Thanks for lending with OXO";
    }
  }

  carLocation() {
    if (this.props.connection == null) {
      return this.state.markerPosition;
    }
    const { connection } = this.props;

    if (connection.status === "CONFIRMED") {
      return {
        latitude: connection.pickupLocation.latitude,
        longitude: connection.pickupLocation.longitude,
        address: connection.pickupLocation.street
      };
    }
    if (connection.status === "LIVE") {
      return {
        latitude: connection.dropoffLocation.latitude,
        longitude: connection.dropoffLocation.longitude,
        address: connection.dropoffLocation.street
      };
    }
    if (connection.status === "COMPLETE") {
      return {
        latitude: connection.dropoffLocation.latitude,
        longitude: connection.dropoffLocation.longitude,
        address: connection.dropoffLocation.street
      };
    }
    return this.state.markerPosition;
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <NavigationEvents
          onWillFocus={payload => {
            if (this.state.id && this.state.token) {
              this.props.dispatchFetchConnection(
                this.state.id,
                this.state.token
              );
            }
          }}
        />
        {this.props.connection ? (
          <MapView
            style={{ flex: 1, width: "100%" }}
            initialRegion={{
              latitude: this.props.connection.pickupLocation.latitude,
              longitude: this.props.connection.pickupLocation.longitude,
              latitudeDelta: this.state.driverPosition.latitudeDelta,
              longitudeDelta: this.state.driverPosition.longitudeDelta
            }}
            provider="google"
            onRegionChangeComplete={() => this.marker.showCallout()}
            showsUserLocation
            followsUserLocation
            loadingEnabled
          >
            {this.getPartnerLocation()}
            <Marker
              ref={marker => {
                this.marker = marker;
              }}
              coordinate={this.props.connection.pickupLocation}
            >
              <Callout>
                <Text>{this.props.connection.pickupLocation.street}</Text>
              </Callout>
            </Marker>
          </MapView>
        ) : (
          <MapView
            style={{ flex: 1, width: "100%" }}
            initialRegion={{
              latitude: this.state.markerPosition.latitude,
              longitude: this.state.markerPosition.longitude,
              latitudeDelta: this.state.driverPosition.latitudeDelta,
              longitudeDelta: this.state.driverPosition.longitudeDelta
            }}
            provider="google"
            showsUserLocation
            followsUserLocation
            loadingEnabled
          />
        )}
        <View style={styles.bannerStyle}>
          <Text style={styles.bannerText}>{this.headerContent()}</Text>
        </View>

        {this.props.connection &&
          (this.props.connection.status === "CONFIRMED" ||
            this.props.connection.status === "LIVE" ||
            this.props.connection.status === "COMPLETE") && (
            <View style={{ flex: 1, paddingBottom: Spacing.tiny }}>
              <MatchDetails connection={this.props.connection} />
            </View>
          )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    connection: state.live.connection,
    loading: state.live.loading,
    error: state.live.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchFetchConnection: (id, token) => dispatch(fetchConnection(id, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandling(LiveMatch));

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  bannerStyle: {
    position: "absolute",
    top: Spacing.large,
    width: Spacing.large * 5,
    paddingTop: Spacing.tiny,
    paddingBottom: Spacing.tiny,
    borderRadius: 20,
    backgroundColor: Colors.primary
  },
  bannerText: {
    color: "white",
    fontSize: Font.large,
    textAlign: "center"
  }
});
