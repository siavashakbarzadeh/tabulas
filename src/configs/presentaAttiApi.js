import axios from "axios";

/**
 * Axios instance for Tabulas4 Presenta Atti API
 * API Documentation: https://svil-tabulas4.intra.senato.it/swagger-ui/index.html
 */
const presentaAttiApi = axios.create({
  baseURL: `https://svil-tabulas4.intra.senato.it`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add auth token to all requests
presentaAttiApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints for Presenta Atti
export const presentaAttiEndpoints = {
  // Get folders where user can deposit
  getFolders: "/v1/tabulas/presenta/atti/where",
  // Save document (docx/html), generate signed PDF
  saveDocument: "/v1/tabulas/presenta/atti/fs/salva",
  // Get PDF in base64
  getPdf: "/v1/tabulas/presenta/atti/pdf/get",
  // Send email with attachments
  sendMail: "/v1/tabulas/presenta/atti/mail/invia",
  // Present act to specific folder (theca)
  presentToTheca: "/v1/tabulas/presenta/atti/old/theca",
};

export default presentaAttiApi;
