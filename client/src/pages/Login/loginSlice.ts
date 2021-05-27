import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface AuthState {
  loggedIn: boolean;
}

const initialState: AuthState = {
  loggedIn: localStorage.getItem('access_token') ? true : false
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
      login: (state) => {
          state.loggedIn = true
      },
      logout: (state) => {
          state.loggedIn = false
      }
  },
});

export const { login, logout } = loginSlice.actions;
export const selectLoggedIn = (state: RootState) => state.login.loggedIn;
export default loginSlice.reducer;
