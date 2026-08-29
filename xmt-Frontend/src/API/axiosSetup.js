import axios from "axios";
import { toast } from "react-toastify";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: "http://localhost:8080/",
});

instance.defaults.withCredentials = true;

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before the request is sent
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with the request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lies within the range of 2xx causes this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = (error && error.response && error.response.status) || 500;
    switch (status) {
      // authentication (token related issues)
      case 401: {
        const url = error?.config?.url;

        if (url !== "/api/v1/account") {
          toast.error("Unauthorized the user. Please login...");
          localStorage.removeItem("jwt");
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }
      // forbidden (permission related issues)
      case 403: {
        window.location.href = "/";
        toast.error("You don't have permission to access this resource...");
        return Promise.reject(error);
      }

      // bad request
      case 400: {
        return Promise.reject(error);
      }

      // not found
      case 404: {
        return Promise.reject(error);
      }

      // conflict
      case 409: {
        return Promise.reject(error);
      }

      // unprocessable
      case 422: {
        return Promise.reject(error);
      }

      // generic api error (server related) unexpected
      default: {
        return Promise.reject(error);
      }
    }
  },
);

export default instance;
