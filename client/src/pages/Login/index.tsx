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
import { login } from './loginSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridItem: {
      display: 'flex',
      justifyContent: 'center',
    },
  })
);

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const classes = useStyles();

  const dispatch = useAppDispatch();

  const responseGoogle = (response: any) => {
    fetch('http://localhost:5000/auth', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/octet-stream; charset=utf-8',
      },
      body: response['code'],
    })
      .then(res => res.json())
      .then(res => {
        localStorage.setItem('access_token', res.data['access_token']);
        localStorage.setItem('refresh_token', res.data['refresh_token']);
        dispatch(login());
      });
  };

  const { signIn, loaded } = useGoogleLogin({
    onSuccess: responseGoogle,
    clientId:
      '866970815825-8eooshnpih6onak81bii9067qvh0s5pd.apps.googleusercontent.com',
    isSignedIn: true,
    responseType: 'code',
    onFailure: responseGoogle,
  });

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} className={classes.gridItem}>
          <Card>
            <CardContent>
              <h2>Login Page</h2>
            </CardContent>
            <CardActions>
              <Button onClick={signIn}>Login</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
