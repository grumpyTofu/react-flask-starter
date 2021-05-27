import { Action, createSlice, Middleware, Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface AuthState {
  loggedIn: boolean;
}

const initialState: AuthState = {
  loggedIn: localStorage.getItem('access_token') ? true : false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: {
      reducer: (state) => {
        state.loggedIn = true
      },
      prepare: (response: any) => {
        const code = response['code'];
        return { payload: { code } }
      }
    },
    loginFail: (state) => {
      state.loggedIn = false
    },
    logout: (state) => {
      state.loggedIn = false
    },
    logoutFail: (state) => {
      state.loggedIn = true
    }
  },
});

export const authMiddleware: Middleware<any, any, Dispatch<Action>> = store => next => action => {
  if (action.type === 'auth/login') {
    fetch('http://localhost:5000/auth', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/octet-stream; charset=utf-8',
      },
      body: action.payload.code,
    })
      .then(res => res.json())
      .then(res => {
        localStorage.setItem('access_token', res.data['access_token']);
        localStorage.setItem('refresh_token', res.data['refresh_token']);
      });
  } else if (action.type === 'auth/loginFail') {
    if (localStorage.getItem('access_token')) {
      localStorage.removeItem('access_token')
    }
    if (localStorage.getItem('refresh_token')) {
      localStorage.removeItem('refresh_token')
    }
  } else if (action.type === 'auth/logout') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  } else if (action.type === 'auth/logoutFail') {
    console.warn('Failed to logout')
  }
  next(action)
}

export const { login, loginFail, logout, logoutFail } = authSlice.actions;
export const selectLoggedIn = (state: RootState) => state.auth.loggedIn;
export default authSlice.reducer;
