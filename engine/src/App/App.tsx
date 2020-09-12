import React, { FunctionComponent } from "react";
import "./App.css";
// import { Auth0Provider } from "./react-auth0-spa";
import config from "./authconfig.json";
import { Auth0Provider } from "./react-auth0-spa";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import Navigator from "../Navigation/Navigator";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Montserrat"
  },
  palette: {
    primary: {
      main: "#001970"
    },
    secondary: {
      main: "#FF5252"
    }
  }
});

const onRedirectCallback = (appState?: any): void => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const App: FunctionComponent = (): React.ReactElement => {
  return (
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      audience={config.audience}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <ThemeProvider theme={theme}>
        <div className="App">
          <Navigator />
        </div>
      </ThemeProvider>
    </Auth0Provider>
  );
};

export default App;
