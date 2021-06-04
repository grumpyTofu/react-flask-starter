import React from 'react';
import {
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useGoogleLogin } from 'react-google-login';
import { useAppDispatch } from '../../app/hooks';
import { login, loginFail } from './authSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '100vh',
      background:
        'linear-gradient(to bottom right, rgba(175, 82, 191, 0.5), rgba(175, 82, 191, 0.2))',
    },
    gridContainer: {
      height: '100%',
    },
    spacer: {
      // flexGrow: 1,
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background:
        'linear-gradient(to bottom right, rgba(255,255,255,0.4), rgba(255,255,255,0.2))',
      backdropFilter: 'blur(1rem)',
      height: '50vh',
      borderRadius: '.75rem',
    },
    glassGridItem: {
      zIndex: 1,
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'center',
      margin: '1rem',
    },
    glassBall: {
      position: 'absolute',
      [theme.breakpoints.up('md')]: {
        height: '15rem',
        width: '15rem',
      },
      [theme.breakpoints.up('xs')]: {
        height: '15rem',
        width: '15rem',
      },
      [theme.breakpoints.down('xs')]: {
        height: '8rem',
        width: '8rem',
      },
      borderRadius: '50%',
      background: '#FFF',
    },
    glassBall1: {
      [theme.breakpoints.up('md')]: {
        top: '12vh',
        right: '12vw',
      },
      [theme.breakpoints.up('xs')]: {
        top: '18vh',
        right: '13vw',
      },
      [theme.breakpoints.down('xs')]: {
        top: '18vh',
        right: '8vw',
      },
      background:
        'linear-gradient(to top left, rgba(175, 82, 191, 0.9), rgba(175, 82, 191, 0.6))',
    },
    glassBall2: {
      [theme.breakpoints.up('md')]: {
        bottom: '12vh',
        left: '8vw',
      },
      [theme.breakpoints.up('xs')]: {
        bottom: '15vh',
        left: '12vw',
      },
      [theme.breakpoints.down('xs')]: {
        bottom: '15vh',
        left: '8vw',
      },
      background:
        'linear-gradient(to top right, rgba(175, 82, 191, 0.7), rgba(175, 82, 191, 0.4))',
    },
  })
);

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const classes = useStyles();

  const dispatch = useAppDispatch();

  const { signIn, loaded } = useGoogleLogin({
    onSuccess: (response: any) => dispatch(login(response)),
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID as string,
    isSignedIn: false,
    responseType: 'code',
    onFailure: () => dispatch(loginFail()),
  });

  return (
    <Container className={classes.container}>
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.gridContainer}
      >
        <div className={clsx(classes.glassBall, classes.glassBall1)}></div>
        <div className={clsx(classes.glassBall, classes.glassBall2)}></div>
        <Grid item xs={8} md={6} className={classes.glassGridItem}>
          <Card className={classes.card}>
            <CardContent className={classes.cardHeader}>
              <h2>React Flask Starter</h2>
            </CardContent>
            <div className={classes.spacer}></div>
            <CardActions className={classes.cardActions}>
              <Button
                variant="contained"
                onClick={signIn}
              >
                Login with Google
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
