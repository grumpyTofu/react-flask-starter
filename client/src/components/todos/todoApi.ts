import { Todo } from "./todoSlice";
import { apiFetch, ApiResponse } from '../../utils/apiFetch';


export function fetchTodos(uid: number | null) {
  return new Promise<ApiResponse<Todo[]>>((resolve) => {
    apiFetch('getTodos').then((res: ApiResponse<Todo[]>) => {
      resolve(res);
    });
  });
}

export function createTodo(title: string, description: string) {
  return new Promise<ApiResponse<Todo>>((resolve) => {
    apiFetch('createTodo', 'POST', { title: title, description: description }).then((res: ApiResponse<Todo>) => {
      resolve(res);
    })
  })
}

export function updateTodo(id: number, patchTodo: Partial<Todo>) {
  return new Promise<ApiResponse<Todo>>((resolve) => {
    apiFetch(`updateTodo/${id}`, 'PATCH', patchTodo).then((res: ApiResponse<Todo>) => {
      resolve(res);
    })
  })
}
