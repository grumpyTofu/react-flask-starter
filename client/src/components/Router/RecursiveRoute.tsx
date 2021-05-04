import React from 'react';
import { Route } from 'react-router-dom';
import { RouteConfig } from '../../App';

interface RouteConfigProps {
  routeConfig: RouteConfig;
}

const RecursiveRoute: React.FC<RouteConfigProps> = ({
  routeConfig: { component, path, routes },
}) => {
  console.log(routes);
  return (
    <>
      <Route path={path} element={component} />
      {routes &&
        routes.map((route: any) => (
          <RecursiveRoute routeConfig={route} key={`RecursiveRoute_${path}`} />
        ))}
    </>
  );
};

export default RecursiveRoute;
