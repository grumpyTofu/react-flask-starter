import { Button, Grid } from '@material-ui/core';
import React from 'react';
import { useAppDispatch } from '../app/hooks';
import { logout } from './Login/loginSlice';

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = ({}) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(logout());
  };
  return (
    <Grid container>
      <Grid item xs={12}>
        <h2>Profile</h2>
        <Button onClick={handleLogout} variant="contained" color="primary">
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};

export default Profile;
