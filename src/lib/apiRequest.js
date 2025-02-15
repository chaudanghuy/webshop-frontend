import axios from "axios";

// console.log(import.meta.env.VITE_PROCESS_API);

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_PROCESS_API,
  withCredentials: true,
});

export default apiRequest;