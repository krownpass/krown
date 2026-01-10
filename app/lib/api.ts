import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: response interceptor for debugging
api.interceptors.response.use(
    (res) => res,
    (err) => {
        // Let UI decide what to do
        return Promise.reject(err);
    }
);

export default api;
