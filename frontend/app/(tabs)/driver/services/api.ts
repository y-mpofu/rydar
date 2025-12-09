// src/services/api.ts
import axios from "axios";
import { router } from "expo-router";
import { getToken, clearAuth } from "./auth";

// ---- API BASE URL ----
const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || "https://rydar.onrender.com";

// ---- Axios instance ----
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// ---- Attach access token ----
api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ---- Response handler ----
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const status = error.response?.status;

        // Unauthorized → logout & redirect
        if (status === 401 || status === 403) {
            await clearAuth();
            router.replace("/driver/login");
        }

        return Promise.reject(error);
    }
);

export default api;
