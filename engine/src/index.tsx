import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App/App";
import * as serviceWorker from "./serviceWorker";

import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import MatchesReducer from "./Pages/MatchList/Redux/MatchListReducer";
import DatabaseReducer from "./Pages/Database/Redux/DatabaseListReducer"

const rootReducer = combineReducers({
  matches: MatchesReducer,
  database: DatabaseReducer
});

const store = createStore(rootReducer, {}, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
