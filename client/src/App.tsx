import React from 'react';
import Layout from './components/Layout';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { Counter } from './components/counter/Counter';
import NotFound from './components/Router/NotFound';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListIcon from '@material-ui/icons/List';

export interface RouteConfig {
  path: string;
  component: any;
  icon: any;
  title: string;
  // routes?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: <Counter />,
    icon: <DashboardIcon />,
    title: 'Dashboard'
  },
  {
    path: '/todos',
    component: <div>Todos</div>,
    icon: <ListIcon />,
    title: 'Todos'
  },
];

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes.map(route => (
            <Route
              path={route.path}
              element={route.component}
              key={`Route_${route.path}`}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
