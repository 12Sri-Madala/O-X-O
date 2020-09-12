import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "../App/react-auth0-spa";

interface PrivateRouteProps {
  component: any;
  path: string;
}

const PrivateRoute = ({
  component: Component,
  path,
  ...rest
}: PrivateRouteProps): React.ReactElement => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect((): void => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async (): Promise<any> => {
      await loginWithRedirect({
        appState: { targetUrl: path }
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  const render = (props: any): React.ReactElement | null =>
    isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
