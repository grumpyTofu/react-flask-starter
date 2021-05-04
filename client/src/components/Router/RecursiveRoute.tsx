import React from 'react';
import { Route } from 'react-router-dom';
import { RouteConfig } from '../../App';

const RecursiveRoute: React.FC<{ routeConfig: RouteConfig }> = ({
  routeConfig: { component, path, routes },
}) => {
  return (
    <>
      <Route exact path={path} component={component} key={`Route_${path}`} />
      {routes && routes.map(route => <RecursiveRoute routeConfig={route} />)}
    </>
  );
};

export default RecursiveRoute;
