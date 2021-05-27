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
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
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
  })
);

const Layout: React.FC = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
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
            <Avatar className={classes.avatar}>A</Avatar>
          </IconButton>
        </div>
        <Divider />
        <List>
          {routes.map(route => (
            <ListItem button component={Link} to={route.path} key={`ListItem_${route.path}`}>
              <ListItemIcon key={`ListItemIcon_${route.path}`}>{route.icon}</ListItemIcon>
              <ListItemText primary={route.title} key={`ListItemText_${route.path}`} />
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
        <div className={classes.toolbar} />
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

export default Layout;
