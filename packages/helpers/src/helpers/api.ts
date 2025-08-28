import axios from 'axios';

export const api = axios;

export function setBaseURL(url: string) {
  api.defaults.baseURL = url;
}

export function setAuthHeader(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function deleteAuthHeader() {
  api.defaults.headers.common['Authorization'] = undefined;
}

export function handleError(error: unknown): string {
  return api.isAxiosError(error) ? error.response?.data.message : 'Ошибка';
}
