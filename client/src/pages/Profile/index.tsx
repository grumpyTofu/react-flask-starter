import { Button, Grid } from '@material-ui/core';
import React from 'react';
import { useGoogleLogout } from 'react-google-login';
import { useAppDispatch } from '../../app/hooks';
import { logout, logoutFail } from '../Login/authSlice';

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = ({}) => {
  const dispatch = useAppDispatch();

  const { signOut } = useGoogleLogout({
    onLogoutSuccess: () => dispatch(logout()),
    clientId:
      '866970815825-8eooshnpih6onak81bii9067qvh0s5pd.apps.googleusercontent.com',
    onFailure: () => dispatch(logoutFail()),
  });

  return (
    <Grid container>
      <Grid item xs={12}>
        <h2>Profile</h2>
        <Button onClick={signOut} variant="contained" color="primary">
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};

export default Profile;
