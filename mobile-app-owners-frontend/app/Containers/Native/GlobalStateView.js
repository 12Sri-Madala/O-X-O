import React from "react";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as TaskManager from "expo-task-manager";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  StatusBar,
  AsyncStorage,
  Platform
} from "react-native";
import { Notifications } from "expo";
import AppNavigator from "../../Screens/Nav/Native/AppNavigator";

import serverInfo from "../../Resources/serverInfo";

const LOCATION_TASK_NAME = "background-location-task";

class GlobalStateView extends React.Component {
  /*
   * Note: This is an example of how to initialize a notification channel, which
   * is required by Android 8+ devices. Expo will "polyfill" for Android 7 and below,
   * carrying along properties specified by the channel object. Unfortunately,
   * this does NOT include the priority property, and it is currently impossible
   * to use the Expo Notifications module to send high/max priority (i.e. heads
   * up) notifications to devices running Android 7 or below.
   *
   * Additionally, while we have verified the ability to send notifications to
   * this channel, we still need to test that notifications sent to this test
   * channel appear as heads up notifications on an Android 8+ device (cannot
   * get Expo push token from the emulator).
   */
  initAndroidNotificationChannel = () => {
    const channelId = "1";
    const channel = {
      name: "test channel for high priority notifications", // user-facing name of the channel
      sound: true,
      priority: "max" // min | low | default | high | max
    };
    Notifications.createChannelAndroidAsync(channelId, channel);
  };

  registerLocationTask = async () => {
    console.log("Registering background task");
    if (this.props.live) {
      console.log("Found the live prop");
      const tasks = await TaskManager.getRegisteredTasksAsync();
      const isBackgroundLocatioRegistered = await TaskManager.isTaskRegisteredAsync(
        LOCATION_TASK_NAME
      );
      if (!isBackgroundLocatioRegistered) {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status === "granted") {
          console.log("About to register task.");
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.High,
            distanceInterval: 30,
            timeInterval: 10000
          });
        }
      }
    } else {
      console.log("quitting task");
      const isBackgroundLocatioRegistered = await TaskManager.isTaskRegisteredAsync(
        LOCATION_TASK_NAME
      );
      if (isBackgroundLocatioRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
    }
  };

  render() {
    this.registerLocationTask();
    // Handles adding and removing location services when a match is live
    if (Platform.OS === "android") {
      this.initAndroidNotificationChannel();
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

const mapStateToProps = state => {
  return {
    live: state.live.connection
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalStateView);

// Additional Functions
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log("There was an error in the location task", error);
    return;
  }
  console.log("updating location");
  const id = await AsyncStorage.getItem("id");
  const token = await AsyncStorage.getItem("token");
  if (data) {
    const { locations } = data;
    fetch(`${serverInfo.name}/location/locationUpdate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ payload: locations, token, id })
    });
    // do something with the locations captured in the background
  }
});
