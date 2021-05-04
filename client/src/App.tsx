import React from 'react';
import Layout from './components/Layout';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useOutlet,
} from 'react-router-dom';
import { Counter } from './components/counter/Counter';
import RecursiveRoute from './components/Router/RecursiveRoute';
import NotFound from './components/Router/NotFound';

export interface RouteConfig {
  path: string;
  component: any;
  routes?: RouteConfig[];
}

const routeConfig: RouteConfig[] = [
  {
    path: '/',
    component: <Counter />,
  },
  {
    path: '/invoices',
    component: <div>Invoices</div>,
  },
  {
    path: '/dashboard',
    component: <div>Dashboard</div>,
  },
  {
    path: '/test',
    component: <div>Test</div>,
  },
  {
    path: '/test/recursive',
    component: <div>Recursive</div>,
  },
  {
    path: '/test/recursive/routes',
    component: <div>Recursive Route</div>,
  },
];

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routeConfig.map(route => (
            <Route
              path={route.path}
              element={route.component}
              key={`RecursiveRoute_${route.path}`}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
