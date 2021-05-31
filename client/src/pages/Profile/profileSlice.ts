import { createSlice, Middleware, Dispatch, Action, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface User {
    uid: number | null;
    name: string | null;
    email: string | null;
    picture: string | null;
}

export interface ProfileState {
    user: User | null;
}

const initialState: ProfileState = {
    user: null
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        }
    }
});

export const profileMiddleware: Middleware<any, any, Dispatch<Action>> = store => next => action => {
    if (profileSlice.actions.setUser.match(action) && action.payload && action.payload.picture) {
        localStorage.setItem('profile_picture', action.payload.picture);
    }
    next(action);
}

export const { setUser } = profileSlice.actions;
export const selectUser = (state: RootState) => state.profile.user;
export default profileSlice.reducer;
