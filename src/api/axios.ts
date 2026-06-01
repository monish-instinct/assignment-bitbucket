import axios from "axios";

export const API_BASE_URL = "https://reqres.in/api";
export const API_KEY = "free_user_3EKyvbq9TuswlrRHQfaQh8ApEVj";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      error.friendlyMessage = "Network Error. Please try again.";
    } else if (error.response.status === 401) {
      error.friendlyMessage = "Session expired. Please login again.";
    } else if (error.response.status >= 500) {
      error.friendlyMessage = "Something went wrong.";
    } else {
      error.friendlyMessage =
        error.response.data?.error || "Something went wrong.";
    }
    return Promise.reject(error);
  },
);

export default api;
