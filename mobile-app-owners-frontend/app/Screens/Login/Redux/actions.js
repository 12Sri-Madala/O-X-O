import { AsyncStorage } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import {
  SAVE_PHONE,
  SEND_CODE_STARTED,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAILURE,
  VERIFY_CODE_STARTED,
  VERIFY_CODE_SUCCESS,
  VERIFY_CODE_FAILURE,
  SAVE_USER_STARTED,
  SAVE_USER_SUCCESS,
  SAVE_USER_FAILURE,
  SAVE_ADDRESS_STARTED,
  SAVE_ADDRESS_SUCCESS,
  SAVE_ADDRESS_FAILURE,
  SAVE_IMAGE_STARTED,
  SAVE_IMAGE_SUCCESS,
  SAVE_IMAGE_FAILURE
} from "./types.js";

import serverInfo from "../../../Resources/serverInfo.js";

export function savePhoneInfo(phoneInfo) {
  return {
    type: SAVE_PHONE,
    payload: phoneInfo
  };
}

export function sendCode(phoneInfo, nav) {
  return dispatch => {
    dispatch(sendCodeStarted());
    console.log("phoneInfo", phoneInfo);
    const payload = JSON.stringify(phoneInfo.payload);
    try {
      fetch(`${serverInfo.name}/login/twilio/sendCode`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: payload
      })
        .then(response => {
          console.log(response);
          response.json();
        })
        .then(responseJson => {
          console.log(responseJson);
          dispatch(sendCodeSuccess(responseJson, nav));
        });
    } catch (error) {
      console.log(error);
      dispatch(sendCodeFailure(error));
    }
  };
}

function sendCodeStarted() {
  return {
    type: SEND_CODE_STARTED
  };
}

function sendCodeSuccess(response, nav) {
  nav.navigate("CodeVerification");
  return {
    type: SEND_CODE_SUCCESS,
    payload: {
      response
    }
  };
}

/* In future, expand this to dispatch an action notifying developers of error. Send user
information and error details. */
function sendCodeFailure(error) {
  return {
    type: SEND_CODE_FAILURE,
    payload: {
      error
    }
  };
}

export function verifyCode(phone, code, nav) {
  return dispatch => {
    dispatch(verifyCodeStarted());
    const payload = JSON.stringify({ userInfo: phone, code });
    try {
      fetch(`${serverInfo.name}/login/twilio/verifyCode`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: payload
      })
        .then(response => response.json())
        .then(async resJson => {
          if (resJson.correctCode) {
            await AsyncStorage.setItem("token", resJson.loginToken);
            if (resJson.existingUser) {
              console.log(resJson.owner);
              await AsyncStorage.setItem("id", resJson.owner.id);
              nav.navigate("Dashboard");
            } else {
              nav.navigate("NewUser");
            }
            dispatch(verifyCodeSuccess(resJson, nav));
          } else {
            dispatch(verifyCodeFailure(resJson));
          }
        });
    } catch (error) {
      console.log(error);
      dispatch(verifyCodeFailure(error));
    }
  };
}

function verifyCodeStarted() {
  return {
    type: VERIFY_CODE_STARTED
  };
}

function verifyCodeSuccess(res) {
  return {
    type: VERIFY_CODE_SUCCESS,
    payload: {
      response: res
    }
  };
}

/* In future, expand this to dispatch an action notifying developers of error. Send user
information and error details. */
function verifyCodeFailure(error) {
  return {
    type: VERIFY_CODE_FAILURE,
    payload: {
      error
    }
  };
}

async function registerForPushNotificationsAsync(id, token) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return null;
  }

  // Get the token that uniquely identifies this device
  const deviceToken = await Notifications.getExpoPushTokenAsync();
  try {
    fetch(`${serverInfo.name}/login/saveDeviceToken`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        token,
        deviceToken
      })
    });
  } catch (error) {
    console.log(error);
    console.log("There was an error with your notification token.");
  }
}

async function requestLocationPermission() {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  return status;
}

export function saveUser(user, nav) {
  return async dispatch => {
    dispatch(saveUserStarted());
    const id = await AsyncStorage.getItem("id");
    user.id = id;
    const payload = JSON.stringify(user);
    try {
      fetch(`${serverInfo.name}/login/saveUser`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: payload
      })
        .then(response => response.json())
        .then(async responseJson => {
          // Store everything in AsyncStorage!
          await AsyncStorage.setItem("id", responseJson.id.toString());
          await AsyncStorage.setItem("token", responseJson.token);

          await registerForPushNotificationsAsync(
            responseJson.id.toString(),
            responseJson.token
          );
          await requestLocationPermission();
          dispatch(saveUserSuccess(nav));
        });
    } catch (error) {
      console.log(error);
      dispatch(saveUserFailure(error));
    }
  };
}

function saveUserStarted() {
  return {
    type: SAVE_USER_STARTED
  };
}

function saveUserSuccess(nav) {
  nav.navigate("ProfileImage");
  return {
    type: SAVE_USER_SUCCESS
  };
}

function saveUserFailure() {
  return {
    type: SAVE_USER_FAILURE
  };
}

export function saveProfileImage(req, nav) {
  return dispatch => {
    dispatch(saveImageStarted());
    const payload = JSON.stringify(req);
    try {
      fetch(`${serverInfo.name}/login/saveProfileImage`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: payload
      })
        .then(response => response.json())
        .then(async responseJson => {
          if (responseJson.success) {
            dispatch(
              saveImageSuccess(`data:image/png;base64,${req.payload.base64}`)
            );
            nav.navigate("AddressesLogin");
          } else {
            dispatch(saveImageFailure("error"));
          }
        });
    } catch (error) {
      console.log(error);
      dispatch(saveImageFailure(error));
    }
  };
}

function saveImageStarted() {
  return {
    type: SAVE_IMAGE_STARTED
  };
}

function saveImageSuccess(base64) {
  return {
    type: SAVE_IMAGE_SUCCESS,
    payload: base64
  };
}

function saveImageFailure(err) {
  return {
    type: SAVE_IMAGE_FAILURE
  };
}

export function saveAddress(address, nav) {
  return async dispatch => {
    dispatch(saveAddressStarted());
    const payload = JSON.stringify(address);
    try {
      fetch(`${serverInfo.name}/login/saveAddress`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: payload
      })
        .then(response => response.json())
        .then(async responseJson => {
          if (responseJson.success) {
            console.log(responseJson.addresses);
            dispatch(saveAddressSuccess());
            if (nav) nav();
          } else {
            dispatch(saveAddressFailure(responseJson));
          }
        });
    } catch (error) {
      console.log(error);
      dispatch(saveAddressFailure(error));
    }
  };
}

function saveAddressStarted() {
  return {
    type: SAVE_ADDRESS_STARTED
  };
}

function saveAddressSuccess() {
  return {
    type: SAVE_ADDRESS_SUCCESS
  };
}

function saveAddressFailure() {
  return {
    type: SAVE_ADDRESS_FAILURE
  };
}
