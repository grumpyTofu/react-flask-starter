import { Counter } from '../counter/Counter';
import Todos from '../todos/Todos';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListIcon from '@material-ui/icons/List';

export interface RouteConfig {
  path: string;
  component: any;
  icon: any;
  title: string;
  routes?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: <Counter />,
    icon: <DashboardIcon />,
    title: 'Dashboard',
  },
  {
    path: 'todos',
    component: <Todos />,
    icon: <ListIcon />,
    title: 'Todos',
  },
];
