import { Todo } from "./todoSlice";
import { apiFetch, ApiResponse } from '../../utils/apiFetch';


export function fetchTodos(uid: number | null) {
  return new Promise<ApiResponse<Todo[]>>((resolve) => {
    const endpoint = uid ? `getTodos?uid=${uid}` : 'getTodos';
    apiFetch(endpoint).then((res: ApiResponse<Todo[]>) => {
      resolve(res);
    });
  });
}
