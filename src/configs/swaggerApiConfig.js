import axios from "axios";

/**
 * Axios instance for calling the Swagger API directly.
 * This is used for Tabulas endpoints that require direct client-side access
 * (clients must be on the Senato VPN to reach this API).
 */
const swaggerApi = axios.create({
  baseURL: `https://svil-tabulas4.intra.senato.it`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add Authorization header with the JWT token
swaggerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default swaggerApi;
