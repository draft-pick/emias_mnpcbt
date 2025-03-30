import axios from "axios";

const getBaseUrl = () => {
    const host = window.location.hostname;

    if (host === "192.168.141.132") {
        return "http://192.168.141.132:8000/";
    } else if (host === "10.149.98.12") {
        return "http://10.149.98.12:8000/";
    } else {
        return "http://localhost:8000/";
    }
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;