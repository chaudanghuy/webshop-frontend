import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://webshop-backend-8c5o.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;