import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    PayloadAction,
    Action,
    Dispatch,
    Middleware,
    isFulfilled
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { logout } from '../../pages/Login/authSlice';
import { ApiResponse, unauthorized } from '../../utils/apiFetch';
import { fetchTodos, createTodo, updateTodo, deleteTodos } from './todoApi';

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

interface CreateTodoInput {
    title: string;
    description: string;
}

export const createTodoAsync = createAsyncThunk(
    'todos/createTodo',
    async ({ title, description }: CreateTodoInput) => {
        const response = await createTodo(title, description);
        return response;
    }
)

export const updateTodoAsync = createAsyncThunk(
    'todos/updateTodoAsync',
    async ({ id, ...patchTodo }: Partial<Todo>) => {
        const response = await updateTodo(id as number, patchTodo);
        return response;
    }
)

export const deleteTodosAsync = createAsyncThunk(
    'todos/deleteTodosAsync',
    async (ids: number[]) => {
        const response = await deleteTodos(ids);
        return response;
    }
)

export const todoSlice = createSlice({
    name: 'todos',
    initialState: todosAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTodosAsync.fulfilled, (state, action: PayloadAction<ApiResponse<Todo[]>>) => {
                todosAdapter.setAll(state, action.payload.data);
            })
            .addCase(createTodoAsync.fulfilled, (state, action: PayloadAction<ApiResponse<Todo>>) => {
                todosAdapter.addOne(state, action.payload.data);
            })
            .addCase(updateTodoAsync.fulfilled, (state, action: PayloadAction<ApiResponse<Todo>>) => {
                const { id, ...updatedTodo } = action.payload.data;
                todosAdapter.updateOne(state, { id: id, changes: updatedTodo });
            })
            .addCase(deleteTodosAsync.fulfilled, (state, action: PayloadAction<ApiResponse<number[]>>) => {
                todosAdapter.removeMany(state, action.payload.data);
            });
    },
});

export const todoMiddleware: Middleware<any, any, Dispatch<Action>> = store => next => action => {
    console.log(isFulfilled(action))
    if (getTodosAsync.fulfilled.match(action)) {
        if (action.payload.message === unauthorized) {
            store.dispatch(logout());
        }
    }
    next(action);
}

export const todosSelector = todosAdapter.getSelectors<RootState>((state) => state.todos);
export default todoSlice.reducer;
