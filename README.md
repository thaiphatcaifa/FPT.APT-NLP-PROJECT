# EduNext — Đề bài 2: Hệ thống Tra cứu Luật Lao động 2019 & Hợp đồng Nhân sự (RAG + LlamaIndex)

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688)
![LlamaIndex](https://img.shields.io/badge/LlamaIndex-0.14-orange)
![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorDB-purple)
![Gemini API](https://img.shields.io/badge/Gemini_API-3.6_Flash-green)
![React](https://img.shields.io/badge/React-19-cyan)
![Vite](https://img.shields.io/badge/Vite-6-646CFF)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3)

Hệ thống Tra cứu Thông tin Luật Lao động 2019 & Hợp đồng Nhân sự ứng dụng kiến trúc **RAG (Retrieval-Augmented Generation)** nâng cao dựa trên framework **LlamaIndex**, cơ sở dữ liệu véc-tơ **ChromaDB**, mô hình ngôn ngữ lớn **Gemini 3.6 Flash** và giao diện trực quan **ReactJS + Bootstrap 5**.

Mục tiêu dự án: Giải quyết triệt để vấn đề suy đoán sai (Hallucination) của LLM thuần túy khi trả lời các thắc mắc về thời hạn báo trước chấm dứt HĐLD, chế độ thai sản, tính tiền lương làm thêm giờ (150%, 200%, 300%) và quy trình xử lý kỷ luật lao động.

---

## 1. Công nghệ & Kiến trúc Hệ thống

### 🛠️ Backend
- **Framework:** Python 3.10+ & **FastAPI**
- **RAG Engine:** **LlamaIndex** (Core, VectorStoreIndex, MetadataFilters, ExactMatchFilter)
- **Vector Database:** **ChromaDB** (Persistent Storage lưu tại `Backend/storage/chroma`)
- **LLM Generator:** **Google Gemini Free API** (`gemini-3.6-flash`) kèm bộ `FallbackLLMGenerator` phòng thủ
- **Embedding Models:**
  - Mặc định: `sentence-transformers/all-MiniLM-L6-v2` (384 chiều)
  - So sánh (Alt): `BAAI/bge-small-en-v1.5` (384 chiều)

### 🎨 Frontend
- **Framework:** **React 19** dựng bằng **Vite 6**
- **UI Components:** **Bootstrap 5.3**, Bootstrap Icons, Lucide React Icons
- **HTTP Client:** **Axios** (kết nối RESTful API với Timeout & Interceptor)

---

## 2. Danh sách 5 Task Báo cáo Học thuật (100% Đã hoàn thành)

| Task | Tên Kỹ thuật RAG | API Endpoint | Mô tả Chi tiết |
|---|---|---|---|
| **Task 1** | **Dense Vector Indexing & Top-K Search** | `/api/index`, `/api/search-similarity` | Tạo chỉ mục véc-tơ Dense, tìm kiếm văn bản pháp luật tương đồng ngữ nghĩa bằng Cosine Similarity. |
| **Task 2** | **Retrieve-then-Generate (RAG vs Non-RAG)** | `/api/query` | Truy vấn ngữ cảnh từ ChromaDB rồi đưa vào Gemini API trả lời. Tự động phát hiện lỗi ảo giác (Hallucination) của Non-RAG. |
| **Task 3** | **Semantic Chunking Comparison** | `/api/chunking-compare` | So sánh hiệu năng và độ chính xác của các kích thước cắt đoạn (Chunk Size: 128, 256, 512, 1024 tokens). |
| **Task 4** | **Metadata Filtering** | `/api/query` (với param `filters`) | Lọc chính xác theo metadata: `loai_hop_dong`, `chu_de`, `phap_ly`, `doi_tuong`. |
| **Task 5** | **Embedding Model Comparison** | `/api/embedding-compare` | Đánh giá độ trễ và chất lượng biểu diễn giữa `all-MiniLM-L6-v2` và `bge-small-en-v1.5`. |

---

## 3. Cấu trúc Thư mục Dự án

```text
He-Thong-Tra-Cuu-LLD-HDNS/
├── .gitignore                      # Bảo mật chặn file .env, storage, venv, node_modules
├── README.md                       # Tài liệu hướng dẫn dự án (File này)
├── Backend/                        # Mã nguồn Python Backend
│   ├── .env                        # File cấu hình API Key (không commit)
│   ├── .env.example                # File mẫu cấu hình biến môi trường
│   ├── .gitignore                  # Gitignore riêng cho Backend
│   ├── requirements.txt            # Danh sách thư viện Python
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI App Entrypoint & CORS setup
│   │   ├── config.py               # Quản lý cấu hình & Load biến môi trường
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic Schemas cho API Request/Response
│   │   ├── routers/                # 4 Router xử lý các nhóm API
│   │   │   ├── index_router.py
│   │   │   ├── query_router.py
│   │   │   ├── chunking_router.py
│   │   │   └── embedding_router.py
│   │   ├── services/               # Core RAG logic & LlamaIndex Integration
│   │   │   ├── rag_service.py      # Execute RAG / Non-RAG & Fallback Generator
│   │   │   ├── indexing_service.py # Quản lý ChromaDB VectorStoreIndex
│   │   │   ├── chunking_service.py # Semantic Chunking & Comparison
│   │   │   ├── embedding_service.py# Nạp & so sánh Embedding Models
│   │   │   └── metadata_service.py # Metadata filtering & Schema extraction
│   │   └── utils/
│   │       └── logger.py           # Logger UTF-8 chuẩn hóa trên Windows
│   ├── data/                       # Dữ liệu Luật Lao động 2019 & HĐLD
│   │   ├── passage_01_thoi_han_bao_truoc.txt
│   │   ├── passage_02_che_do_thai_san.txt
│   │   ├── passage_03_luong_lam_them_gio.txt
│   │   ├── quy_dinh_ky_luat_lao_dong_dai.txt
│   │   └── metadata.json
│   ├── storage/                    # Persistent storage của ChromaDB Vector DB
│   └── notebooks/
│       └── bao_cao_rag_llamaindex.ipynb # Notebook báo cáo thực nghiệm
└── Frontend/                       # Mã nguồn ReactJS Frontend (Vite)
    ├── .gitignore
    ├── README.md
    ├── package.json
    ├── vite.config.js              # Cấu hình Vite Dev Server (Port 5173, Host true)
    ├── index.html
    └── src/
        ├── main.jsx                # Entrypoint React 19
        ├── App.jsx                 # Layout chính tích hợp Tab Navigation
        ├── index.css               # Import Bootstrap & CSS Variables
        ├── api/
        │   └── axiosClient.js      # Axios client kết nối http://localhost:8000
        ├── components/             # Reusable Components
        │   ├── Navbar.jsx          # Thanh điều hướng Topbar
        │   ├── QueryForm.jsx       # Form tìm kiếm & bộ lọc Metadata
        │   ├── AnswerCard.jsx      # Card hiển thị câu trả lời RAG & căn cứ pháp lý
        │   ├── SourceList.jsx      # Danh sách trích dẫn tài liệu gốc (Sources)
        │   ├── RagVsNonRagCompare.jsx # Bảng so sánh phát hiện ảo giác (Task 2)
        │   ├── ChunkingComparePanel.jsx # Panel thực nghiệm Task 3
        │   └── EmbeddingComparePanel.jsx# Panel thực nghiệm Task 5
        └── pages/                  # Các trang màn hình chính
            ├── HomePage.jsx        # Tra cứu RAG & So sánh Non-RAG
            ├── IndexPage.jsx       # Quản lý & Xem chỉ mục Vector DB
            ├── ComparePage.jsx     # Tổng hợp so sánh Task 3 & Task 5
            └── AboutPage.jsx       # Giới thiệu kiến trúc RAG Stack
```

---

## 4. Hướng dẫn Cài đặt & Khởi chạy Chi tiết

### 📋 Bước 1: Chuẩn bị Môi trường
Yêu cầu máy tính đã cài đặt:
- **Python:** phiên bản 3.10 trở lên.
- **Node.js:** phiên bản 18 trở lên.
- **Git**

---

### ⚙️ Bước 2: Cấu hình Backend (Python FastAPI)

1. **Truy cập thư mục `Backend`:**
   ```bash
   cd Backend
   ```

2. **Tạo và kích hoạt Môi trường ảo Python (venv):**
   - Windows (PowerShell / Command Prompt):
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - macOS / Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Cài đặt các gói phụ thuộc:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Tạo file cấu hình môi trường `.env`:**
   Tạo file `.env` tại thư mục `Backend/` (hoặc sao chép từ `.env.example`):
   ```env
   # Cấu hình API Keys & Mô hình AI
   GEMINI_API_KEY=dán_gemini_api_key_của_bạn_vào_đây
   LLM_MODEL_NAME=gemini-3.6-flash

   # Cấu hình Embedding Local (HuggingFace)
   EMBEDDING_MODEL_DEFAULT=sentence-transformers/all-MiniLM-L6-v2
   EMBEDDING_MODEL_ALT=BAAI/bge-small-en-v1.5

   # Lưu trữ dữ liệu & Persistent Storage
   DATA_DIR=data
   STORAGE_DIR=storage/chroma
   COLLECTION_NAME=luat_lao_dong_collection

   # Cấu hình CORS Server
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
   PORT=8000
   ```
   *(Lưu ý: Lấy Gemini API Key miễn phí tại [Google AI Studio](https://aistudio.google.com/))*

5. **Khởi chạy Backend Server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - **Kiểm tra Health Check Backend:** mở trình duyệt truy cập `http://localhost:8000`
   - **Xem tài liệu Swagger API Docs:** mở trình duyệt truy cập `http://localhost:8000/docs`

---

### 💻 Bước 3: Cấu hình Frontend (ReactJS + Vite)

1. **Mở một Terminal mới và truy cập thư mục `Frontend`:**
   ```bash
   cd Frontend
   ```

2. **Cài đặt các gói phụ thuộc npm:**
   ```bash
   npm install
   ```

3. **Khởi chạy Frontend Dev Server:**
   ```bash
   npm run dev
   ```

4. **Truy cập Giao diện Web:**
   Trình duyệt sẽ khởi chạy tại địa chỉ: **`http://localhost:5173`**

---

## 5. Chạy Đồng thời cả 2 Server để Demo

Mở 2 cửa sổ Terminal riêng biệt:

```bash
# Terminal 1 — Backend API Server (Cổng 8000)
cd Backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend User Interface (Cổng 5173)
cd Frontend
npm run dev
```

---

## 6. Hướng dẫn Thao tác Demo trên Giao diện Web

1. **Màn hình Tra cứu & RAG (Task 2 & Task 4):**
   - Nhập câu hỏi thắc mắc Luật Lao động (VD: *"Hợp đồng 24 tháng đơn phương chấm dứt cần báo trước bao nhiêu ngày?"*).
   - Chọn bộ lọc Metadata (Loại hợp đồng, Chủ đề) để test **Task 4**.
   - Bấm **"Gửi câu hỏi"**: Giao diện hiển thị phản hồi RAG kèm **Căn cứ pháp lý trích dẫn (Source Nodes)** và Bảng so sánh **Non-RAG vs RAG** phát hiện lỗi ảo giác Hallucination (**Task 2**).

2. **Màn hình Dense Vector Index (Task 1):**
   - Xem thống kê số lượng văn bản, vector embedding đã Index trong ChromaDB.
   - Thử nghiệm tính năng **Top-K Similarity Search** để xem điểm số đồng dạng ngữ nghĩa (Cosine Similarity Score).

3. **Màn hình So sánh Chunk Size (Task 3):**
   - Chạy thử nghiệm phân tách văn bản theo các kích thước Chunk Size (128, 256, 512, 1024 tokens) và quan sát chỉ số Retrieval Precision.

4. **Màn hình So sánh Embedding Models (Task 5):**
   - Đánh giá thời gian phản hồi và chất lượng truy vấn giữa 2 mô hình `sentence-transformers/all-MiniLM-L6-v2` và `BAAI/bge-small-en-v1.5`.

---

## 7. Báo cáo Jupyter Notebook

File Notebook tổng hợp báo cáo thực nghiệm 5 Task lưu tại:
[`Backend/notebooks/bao_cao_rag_llamaindex.ipynb`](file:///c:/HK2%20T3.2511.M0/Agents/Edunext/He-Thong-Tra-Cuu-LLD-HDNS/Backend/notebooks/bao_cao_rag_llamaindex.ipynb)

Để khởi chạy Notebook:
```bash
cd Backend
.\venv\Scripts\activate
pip install jupyter
jupyter notebook notebooks/bao_cao_rag_llamaindex.ipynb
```

---

## 8. Đóng góp & Bản quyền

Dự án thuộc Bài tập EduNext - Đề bài 2 (Xây dựng hệ thống RAG tra cứu Luật Lao động 2019 & Hợp đồng Nhân sự).
Bảo lưu mọi quyền. Mã nguồn phát hành dưới giấy phép mã nguồn mở 
https://github.com/TuanPham30011993/He-Thong-Tra-Cuu-LLD-HDNS.

