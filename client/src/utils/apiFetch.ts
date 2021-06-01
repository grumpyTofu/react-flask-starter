export const unauthorized = "UNAUTHORIZED";

export type requestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface ApiResponse<T = any> {
  error: boolean;
  message: string;
  data: T;
}

interface AuthApiResponseData {
  access_token: string;
  refresh_token: string;
  user: {
    uid: string;
    name: string;
    email: string;
  }
}

export const apiFetch = (endpoint: string, method: requestMethod = "GET", body: any = {}): Promise<ApiResponse> => new Promise(async (resolve) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const jwt = localStorage.getItem('access_token');
  let options: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`
    }
  };
  if (method !== "GET" && Object.keys(body).length > 0) {
    options.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(`${baseUrl}/${endpoint}`, options);
    if (response.statusText === unauthorized) {
      try {
        const refresh = await fetch(`${baseUrl}/refresh`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
          }
        });
        const refreshJson: ApiResponse<AuthApiResponseData> = await refresh.json();
        if (refreshJson.error) {
          const data: ApiResponse = {
            error: true,
            message: refreshJson.message,
            data: []
          }
          resolve(data);
        } else {
          localStorage.setItem('access_token', refreshJson.data.access_token)
          localStorage.setItem('refresh_token', refreshJson.data.refresh_token)
          options.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshJson.data.access_token}`
          }
          const retry = await fetch(`${baseUrl}/${endpoint}`, options);
          const retryJson: ApiResponse = await retry.json();
          resolve(retryJson)
        }
      } catch (e: any) {
        const error = e as Error;
        console.log(error.message)
        if (error.message === 'Failed to fetch') {
          console.warn('Connection error');
          const data: ApiResponse = {
            error: true,
            message: error.message,
            data: []
          }
          resolve(data);
        }
        const data: ApiResponse = {
          error: true,
          message: error.message,
          data: []
        }
        resolve(data);
      }
    }
    const responseData = await response.json();
    resolve(responseData);
  } catch (e: any) {
    const error = e as Error;
    if (error.message === 'Failed to fetch') {
      console.warn('Connection error');
      const data: ApiResponse = {
        error: true,
        message: error.message,
        data: []
      }
      resolve(data);
    }
    const data: ApiResponse = {
      error: true,
      message: error.message,
      data: []
    }
    resolve(data);
  }
});