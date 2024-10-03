import axios, { AxiosInstance } from "axios";
import { BASE_URL } from "../endpoints/sellerEndpoints";
import { toast } from "sonner";

export const createSellerAxios = (token: string | null): AxiosInstance => {
    const sellerAxios = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });

    sellerAxios.interceptors.request.use(
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

    sellerAxios.interceptors.response.use(
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

    return sellerAxios;
};