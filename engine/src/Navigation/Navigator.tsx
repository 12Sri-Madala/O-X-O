import React, { FunctionComponent } from "react";
// import { Auth0Provider } from "./react-auth0-spa";
import { useAuth0 } from "../App/react-auth0-spa";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import MatchList from "../Pages/MatchList/MatchList";
import Database from "../Pages/Database/Database";
import Table from "../Pages/Database/Table";
import NavigationHeader from "./NavigationHeader";

const Navigator: FunctionComponent = (): React.ReactElement | null => {
  const { loading, loginWithRedirect, isAuthenticated } = useAuth0();
  if (loading) {
    return <div>Loading..</div>;
  }
  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }
  return (
    <BrowserRouter>
      <NavigationHeader />
      <Switch>
        <Route path="/" exact />
        <PrivateRoute path="/matchlist" component={MatchList} />
        <PrivateRoute path="/database" component={Database} />
        <PrivateRoute path="/table/" component={Table} />
      </Switch>
    </BrowserRouter>
  );
};

export default Navigator;
