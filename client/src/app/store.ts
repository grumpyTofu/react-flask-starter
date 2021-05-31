import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../components/counter/counterSlice';
import authReducer, { authMiddleware } from '../pages/Login/authSlice';
import profileReducer, { profileMiddleware } from '../pages/Profile/profileSlice';
import todoReducer, { todoMiddleware } from '../components/todos/todoSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    profile: profileReducer,
    todos: todoReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware).concat(todoMiddleware).concat(profileMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
