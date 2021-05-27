export const useApi = async (endpoint: string, options: RequestInit = {}) => {
  const res = await (await (await fetch(`localhost:5000/${endpoint}`, options)).json());
  return res;
};
