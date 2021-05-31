import { createSlice, createAsyncThunk, createEntityAdapter, PayloadAction, Action, Dispatch, Middleware } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { logout } from '../../pages/Login/authSlice';
import { ApiResponse, unauthorized } from '../../utils/apiFetch';
import { fetchTodos } from './todoApi';

export interface Todo {
    id: number;
    title: string;
    description: string;
    created_at: string | Date;
    updated_at: string | Date;
}

const todosAdapter = createEntityAdapter<Todo>({
    selectId: (todo) => todo.id,
    sortComparer: (a, b) => a.id - b.id
});
  
export const getTodosAsync = createAsyncThunk(
    'todos/getTodos',
    async (uid: number | null) => {
      const response = await fetchTodos(uid);
      // The value we return becomes the `fulfilled` action payload
      return response;
    }
  );

export const todoSlice = createSlice({
    name: 'todos',
    initialState: todosAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTodosAsync.fulfilled, (state, action: PayloadAction<ApiResponse<Todo[]>>) => {
                todosAdapter.setAll(state, action.payload.data);
            });
    },
});

export const todoMiddleware: Middleware<any, any, Dispatch<Action>> = store => next => action => {
    if(getTodosAsync.fulfilled.match(action)) {
        if (action.payload.message === unauthorized) {
            store.dispatch(logout());
        }
    }
    next(action);
}

export const todosSelector = todosAdapter.getSelectors<RootState>((state) => state.todos);
export default todoSlice.reducer;
