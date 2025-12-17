import axios from "axios";

export const apiHttp = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});
