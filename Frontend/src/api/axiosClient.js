import axios from 'axios';

// Dùng 127.0.0.1 thay cho localhost để tránh lỗi phân giải DNS IPv6 (::1) trên Windows
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // Tăng timeout lên 120s để chờ Gemini API phản hồi mượt mà
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Lỗi kết nối Backend server (Network Error)';
    if (error.response) {
      message = error.response.data?.detail || `Lỗi từ Server (${error.response.status})`;
    } else if (error.request) {
      message = 'Không thể kết nối đến Backend Server (http://127.0.0.1:8000). Vui lòng kiểm tra Uvicorn server đã chạy chưa.';
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
