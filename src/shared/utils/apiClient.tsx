import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://192.168.1.172:27755',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          window.location.href = '/auth';
        }
      }
      return Promise.reject(error);
    }
  );

export const get = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await apiClient.get<T>(url, config);
    return data;
}


export const post = async <T = any>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,

): Promise<T> => {
    const { data } = await apiClient.post<T>(url, body, config);
    return data 
};


export const del = async <T = any>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<T> => {
    const { data } = await apiClient.delete<T>(url, config);
    return data;
}

export default apiClient;