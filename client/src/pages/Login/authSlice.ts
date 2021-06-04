import { createSlice, Action, Middleware, Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ApiResponse } from '../../utils/apiFetch';
// import { getUserTodosAsync } from '../../components/todos/todosSlice';
import { setUser } from '../Profile/profileSlice';
// import { getPublicTodosAsync, getUserTodosAsync } from '../../components/todos/todosSlice'; TODO: Find type-safe fix
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
  if (authSlice.actions.login.match(action)) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/octet-stream; charset=utf-8',
      },
      body: action.payload.code,
    })
      .then(res => res.json())
      .then((res: ApiResponse) => {
        if (res.error) {
          store.dispatch(loginFail());
        } else {
          localStorage.setItem('access_token', res.data['access_token']);
          localStorage.setItem('refresh_token', res.data['refresh_token']);
          store.dispatch(setUser(res['data']['user']));
        }
      }).catch(error => {
        console.error(error);
      });
  } else if (authSlice.actions.loginFail.match(action)) {
    if (localStorage.getItem('access_token')) {
      localStorage.removeItem('access_token')
    }
    if (localStorage.getItem('refresh_token')) {
      localStorage.removeItem('refresh_token')
    }
  } else if (authSlice.actions.logout.match(action)) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('profile_picture');
  } else if (authSlice.actions.logoutFail.match(action)) {
    console.warn('Failed to logout')
  }
  next(action)
}

export const { login, loginFail, logout, logoutFail } = authSlice.actions;
export const selectLoggedIn = (state: RootState) => state.auth.loggedIn;
export default authSlice.reducer;
