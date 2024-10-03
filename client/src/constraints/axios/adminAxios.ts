import axios, { AxiosInstance } from "axios";
import { BASE_URL } from "../endpoints/adminEndpoints";
import { toast } from "sonner";

export const createAdminAxios = (token: string | null): AxiosInstance => {
    const adminAxios = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });

    adminAxios.interceptors.request.use(
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

    adminAxios.interceptors.response.use(
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

    return adminAxios;
};