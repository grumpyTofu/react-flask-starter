import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import {
  Container,
  Drawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Avatar } from '@material-ui/core';
import { routes } from './Router/Config';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../pages/Profile/profileSlice';
import Blob from './Blob';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      margin: 0,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      '& .MuiListItem-root': {
        justifyContent: 'center',
      },
      '& .MuiListItemIcon-root': {
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9) + 1,
        },
        justifyContent: 'center',
      },
      '& .MuiListItem-gutters': {
        paddingRight: 0,
        paddingLeft: 0,
      },
    },
    drawerOverride: {
      // backgroundColor: theme.palette.primary.main,
      background:
        'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(255,255,255,0.5))',
      color: theme.palette.common.black,
      border: 'none',
      boxShadow:
        '1px 0px 2px -1px rgb(0 0 0 / 20%), 1px 0px 1px 0px rgb(0 0 0 / 14%), 1px 0px 3px 0px rgb(0 0 0 / 12%)',
      backdropFilter: 'blur(1rem)',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      zIndex: 1,
      overflow: 'scroll',
    },
    sidebarControl: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    alignLeft: {
      display: 'flex',
      justifyContent: 'flex-start !important',
    },
    alignRight: {
      display: 'flex',
      justifyContent: 'flex-end !important',
    },
    avatar: {
      height: theme.spacing(4),
      width: theme.spacing(4),
    },
    background: {
      minHeight: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
    },
    blob1: {
      fill: 'rgba(156, 38, 176, .4)',
      position: 'absolute',
      top: '30vh',
      right: '-45vw',
      width: '70vmax',
      height: '5vmax',
      zIndex: -2,
      transform: 'rotate(160deg)',
    },
    blob2: {
      fill: 'rgba(156, 38, 176, .55)',
      left: '5vw',
      width: '45vmax',
      bottom: '-10vh',
      height: '10vmax',
      zIndex: -2,
      position: 'absolute',
      transform: 'rotate(140deg)',
    },
    backdropGlass: {
      height: '100vh',
      width: '100vw',
      zIndex: -1,
      background:
        'linear-gradient(to bottom right, rgba(255,255,255,.3), rgba(255,255,255,.1))',
      backgroundRepeat: 'no-repeat',
      backdropFilter: 'blur(.5rem)',
    },
  })
);

const Layout: React.FC = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const user = useAppSelector(selectUser);
  const [open, setOpen] = useState<boolean>(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <div className={classes.background}>
        <Blob className={classes.blob1} />
        <Blob className={classes.blob2} />
        <div className={classes.backdropGlass}></div>
      </div>
      {/* <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          
          <Typography variant="h6" noWrap>
            Mini variant drawer
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx(
            {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            },
            classes.drawerOverride
          ),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton component={Link} to="profile">
            <Avatar
              className={classes.avatar}
              src={
                localStorage.getItem('profile_picture')
                  ? (localStorage.getItem('profile_picture') as string)
                  : user
                  ? (user.picture as string)
                  : undefined
              }
            >
              {user && user.name ? user.name[0] : 'A'}
            </Avatar>
          </IconButton>
        </div>
        <Divider />
        <List>
          {routes.map(route => (
            <ListItem
              button
              component={Link}
              to={route.path}
              key={`ListItem_${route.path}`}
            >
              <ListItemIcon key={`ListItemIcon_${route.path}`}>
                {route.icon}
              </ListItemIcon>
              <ListItemText
                primary={route.title}
                key={`ListItemText_${route.path}`}
              />
            </ListItem>
          ))}
        </List>
        <div className={classes.sidebarControl}>
          <List>
            <ListItem
              button
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              className={clsx({
                [classes.alignRight]: open,
              })}
            >
              {open ? (
                <ListItemIcon>
                  {theme.direction === 'rtl' ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </ListItemIcon>
              ) : (
                <ListItemIcon>
                  <ChevronRightIcon />
                </ListItemIcon>
              )}
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        {/* <div className={classes.toolbar} /> */}
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

export default Layout;
