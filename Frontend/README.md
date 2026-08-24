# EduNext Frontend — Giao diện Tra cứu Luật Lao động (ReactJS + Vite)

Giao diện Web Client của hệ thống Tra cứu Luật Lao động 2019 & Hợp đồng Nhân sự sử dụng **React 19**, **Vite 6**, **Bootstrap 5.3** và **Axios**.

## 1. Yêu cầu Hệ thống
- **Node.js:** v18.0.0 trở lên
- **npm:** v9.0.0 trở lên

## 2. Thư viện Chính Sử dụng
- `react` & `react-dom` (v19)
- `vite` (v6) - Toolchain build siêu nhanh
- `bootstrap` (v5.3) & `bootstrap-icons` - Thư viện giao diện chuẩn
- `axios` - HTTP Client gọi RESTful API tới Backend Python
- `lucide-react` - Iconset hiện đại

## 3. Cài đặt & Chạy ứng dụng

```bash
# 1. Truy cập thư mục Frontend
cd Frontend

# 2. Cài đặt dependencies
npm install

# 3. Chạy Dev Server
npm run dev
```

Trình duyệt mở tại: **`http://localhost:5173`**

## 4. Kết nối Backend API
Cấu hình Axios Client lưu tại `src/api/axiosClient.js` tự động trỏ về Backend Server tại `http://localhost:8000`.

Nguồn tài liệu tổng thể dự án: Xem chi tiết tại [README chính ở thư mục gốc](../README.md).
