import axios, { AxiosInstance } from "axios";
import { BASE_URL } from "../endpoints/userEndpoints";
import { toast } from "sonner";

export const createUserAxios = (token: string | null): AxiosInstance => {
    const userAxios = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });

    userAxios.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    userAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response && error.response.status === 403) {
                toast.error("Token expired, please log in again.");
            }
            return Promise.reject(error);
        }
    );

    return userAxios;
};