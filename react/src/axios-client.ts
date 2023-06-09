import axios from "axios";

// Create an axios client with a custom config.
const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
});

// Add a request interceptor to add the token to requests
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    // onFulfilled
    (response) => {
        return response;
    },
    // onRejected
    (error) => {
        if (error.response) {
            const { response } = error;

            // if the user is not authorized
            if (response.status === 401) {
                localStorage.removeItem("ACCESS_TOKEN");
            }
        } else {
            // handle error where there is no response from the server
            console.error(
                "Network Error or server did not respond",
                error.message
            );
        }

        throw error;
    }
);

export default axiosClient;
