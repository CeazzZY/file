import Axios from "axios";

const request = Axios.create({
  baseURL: "http://localhost:3000/minio/",
  timeout: 5000,
});

request.interceptors.request.use((config) => {
  return config;
});

export default request;
