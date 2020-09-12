
// // Import components from React and React Native
// import React from 'react';
// import { View, Text, Dimensions } from 'react-native';
// import {MapView} from 'expo'; // expo uses the Airbnb library https://github.com/react-community/react-native-maps

// // Import local components
// import fire from './Firebase.js';

// const {width, height} = Dimensions.get('window');
// const SCREEN_HEIGHT = height;
// const SCREEN_WIDTH = width;
// const ASPECT_RATIO = width/height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA*ASPECT_RATIO;
// const DRIVER_DEFAULT_LATITUDE = 40.741895;
// const DRIVER_DEFAULT_LONGITUDE = -122.405211;
// const CAR_DEFAULT_LATITUDE = 37.792912;
// const CAR_DEFAULT_LONGITUDE = -73.989308;

// // Example from https://hackernoon.com/react-native-basics-geolocation-adf3c0d10112
// class GeolocationExample extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       isMapReady: false,
//       driverPosition: {
//         latitude: DRIVER_DEFAULT_LATITUDE,  // replace this with driver address or default HQ
//         longitude: DRIVER_DEFAULT_LONGITUDE, // replace this with driver address or default HQ
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA,
//       },
//       markerPosition: {
//         latitude: CAR_DEFAULT_LATITUDE,  // replace this with car pickup/dropoff location
//         longitude: CAR_DEFAULT_LONGITUDE, // replace this with car pickup/dropoff location
//       },
//       error: null,
//     };
//   }

//   onMapLayout = () => {
//     this.setState({ isMapReady: true });
//   }

//   componentDidMount() {
//     // watchPosition: gets current location and has success callback, error callback, and config
//     // navigator and Gelocation is built into React Native => this may require some extra config for Android
//     this.watchId = navigator.geolocation.watchPosition(
//       (driverPosition) => {
//         this.setState({
//           driverPosition: {
//             latitude: driverPosition.coords.latitude,
//             longitude: driverPosition.coords.longitude,
//             latitudeDelta: LATITUDE_DELTA,
//             longitudeDelta: LONGITUDE_DELTA,
//           },
//           error: null,
//         });
//       },
//       (error) => this.setState({ error: error.message }),
//       // enableHighAccuracy: most accurate location : slightly slower
//       // timeout: time (ms) to return position before throwing error
//       // maximumAge: time (ms) before old location existing on device is no longer valuable/reliable
//       // distanceFilter: distance traveled (m) before fetched again
//       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 5 },
//     );
//   }

//   componentWillUnmount() {
//     navigator.geolocation.clearWatch(this.watchId);
//   }

//   render() {
//     return (
//       <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <MapView
//           style={{height: '90%', width: '100%' }}
//           initialRegion={{
//             latitude: this.state.driverPosition.latitude,
//             longitude: this.state.driverPosition.longitude,
//             latitudeDelta: this.state.latitudeDelta,
//             longitudeDelta: this.state.longitudeDelta,
//           }}
//           provider={MapView.PROVIDER_GOOGLE}
//           onLayout={this.onMapLayout}
//           showUserLocation
//           followUserLocation
//           loadingEnabled
//         >
//           { this.state.isMapReady &&
//             <Marker.Animated
//               ref={marker => {
//                 this.marker = marker;
//               }}
//               coordinate={this.state.driverPosition}
//             />
//           }
//         </MapView>
//         <Text>Latitude: {this.state.driverPosition.latitude}</Text>
//         <Text>Longitude: {this.state.driverPosition.longitude}</Text>
//         {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
//       </View>
//     );
//   }
// }

// export default GeolocationExample;

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform
} from "react-native";
import MapView, { Marker, AnimatedRegion, Polyline } from "react-native-maps";
import haversine from "haversine";

const LATITUDE = 29.95539;
const LONGITUDE = 78.07513;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;

class AnimatedMarkers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE
      })
    };
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      position => {},
      error => alert(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
      }
    );
  }

  componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const { coordinate, routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude
        };

        if (Platform.OS === "android") {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500
            );
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        this.setState({
          latitude,
          longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          distanceTravelled:
            distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLng: newCoordinate
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000 }
    );
  }

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showUserLocation
          followUserLocation
          loadingEnabled
          region={this.getMapRegion()}
        >
          <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate} />
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.bubble, styles.button]}>
            <Text style={styles.bottomBarContent}>
              {parseFloat(this.state.distanceTravelled).toFixed(2)} km
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: "stretch"
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent"
  }
});

export default AnimatedMarkers;
