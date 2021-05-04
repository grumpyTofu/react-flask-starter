import React from 'react';
import Layout from './components/Layout';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Counter } from './features/counter/Counter';
import RecursiveRoute from './components/Router/RecursiveRoute';
import NotFound from './components/Router/NotFound';

export interface RouteConfig {
  path: string;
  component: React.FC;
  routes?: RouteConfig[];
}

const routeConfig: RouteConfig[] = [
  {
    path: '/',
    component: Counter,
  },
];

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        {routeConfig.map(route => (
          <Switch>
            <RecursiveRoute
              routeConfig={route}
              key={`RecursiveRoute_${route.path}`}
            />
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        ))}
      </Layout>
    </Router>
  );
};

export default App;
