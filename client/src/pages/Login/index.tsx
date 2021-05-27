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
import { useGoogleLogin } from 'react-google-login';
import { useAppDispatch } from '../../app/hooks';
import { login, loginFail } from './authSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '100vh'
    },
    gridContainer: {
      height: '100%'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'center',
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'center',
      margin: '1rem'
    }
  })
);

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const classes = useStyles();

  const dispatch = useAppDispatch();

  const { signIn, loaded } = useGoogleLogin({
    onSuccess: (response: any) => dispatch(login(response)),
    clientId:
      '866970815825-8eooshnpih6onak81bii9067qvh0s5pd.apps.googleusercontent.com',
    isSignedIn: false,
    responseType: 'code',
    onFailure: () => dispatch(loginFail()),
  });

  return (
    <Container className={classes.container}>
      <Grid container justify='center' alignItems='center' className={classes.gridContainer}>
        <Grid item xs={8}>
          <Card>
            <CardContent className={classes.cardHeader}>
              <h2>Login Page</h2>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button variant='contained' color='secondary' onClick={signIn}>Login</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
