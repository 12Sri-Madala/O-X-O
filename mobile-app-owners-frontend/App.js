"use-strict";

import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { AppearanceProvider } from "react-native-appearance";
import GlobalStateView from "./app/Containers/Native/GlobalStateView";

import rootReducer from "./app/Screens/Library/Redux/Reducers.js";

// TODO: Fill out
const initialState = {};
// Add middleware as needed
const middleware = [thunk];
// Create store
const store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(...middleware))
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppearanceProvider>
          <GlobalStateView />
        </AppearanceProvider>
      </Provider>
    );
  }
}
