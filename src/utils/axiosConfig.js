import axios from "axios";

const axiosAPI = axios.create({
  baseURL: `${process.env.REACT_APP_DOMAIN}`,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,
  },
  withCredentials: true,
});

const axiosJWT = axios.create({
  baseURL: `${process.env.REACT_APP_DOMAIN}`,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,
  },
  withCredentials: true,
});

export { axiosAPI, axiosJWT };
