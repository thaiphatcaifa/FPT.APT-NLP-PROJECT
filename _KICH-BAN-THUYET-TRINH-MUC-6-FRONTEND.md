# KỊCH BẢN THUYẾT TRÌNH — MỤC 6: FRONTEND (React + Bootstrap + Axios nối 5 API)

Người trình bày: Bak · Môn 4 HKII — Applied AI for NLP · Đề bài 2: Hệ thống Tra cứu Luật Lao động 2019 (RAG + LlamaIndex)

---

## A. MỞ ĐẦU (30 giây)

> "Phần của em là toàn bộ lớp giao diện. Frontend **không chứa logic AI** — không embedding, không vector search, không gọi Gemini. Nhiệm vụ của nó là: nhận input người dùng, gọi đúng API của 5 task, và **trực quan hoá bằng chứng** để người xem thấy được RAG hoạt động thật chứ không phải LLM đoán."

---

## B. STACK & LÝ DO CHỌN (45 giây)

| Thành phần | Chọn gì | Vì sao |
|---|---|---|
| Framework | React 19 + Vite 6 | Vite dev server khởi động nhanh, HMR tức thì, hợp demo |
| UI | Bootstrap 5.3 + bootstrap-icons | Có sẵn grid/table/badge/progress — không mất thời gian viết CSS |
| HTTP | Axios | Có interceptor + timeout, thứ `fetch` không có sẵn |
| Routing | `useState` trong `App.jsx` | App 5 màn hình, **không cần react-router** → giảm dependency |

---

## C. KIẾN TRÚC FRONTEND (1 phút)

```
src/
├── api/axiosClient.js      ← 1 client dùng chung cho toàn app
├── components/             ← 7 component tái sử dụng
│   ├── Navbar.jsx          · QueryForm.jsx     · AnswerCard.jsx
│   ├── SourceList.jsx      · RagVsNonRagCompare.jsx
│   └── ChunkingComparePanel.jsx · EmbeddingComparePanel.jsx
├── pages/                  ← HomePage · IndexPage · AboutPage
└── App.jsx                 ← tab state → render page tương ứng
```

**Nguyên tắc thiết kế:** `pages` giữ state + gọi API (smart), `components` chỉ nhận props và hiển thị (dumb). Ví dụ `HomePage` gọi API rồi truyền xuống `AnswerCard`, `SourceList`, `RagVsNonRagCompare`.

---

## D. LỚP KẾT NỐI — `axiosClient.js` (điểm kỹ thuật đáng nói nhất, 1 phút)

Bốn quyết định trong ~20 dòng code:

1. **`baseURL = http://127.0.0.1:8000`** chứ không phải `localhost` — trên Windows `localhost` phân giải ra IPv6 `::1`, Uvicorn bind IPv4 → lỗi `ECONNREFUSED`. Đây là bug thật đã gặp.
2. **`timeout: 120000`** (120 giây) — Gemini API free tier phản hồi chậm, mặc định của axios sẽ cắt sớm.
3. **Response interceptor `res => res.data`** — mọi component viết `const res = await axiosClient.post(...)` là có data luôn, không phải `.data` khắp nơi.
4. **Error interceptor chuẩn hoá lỗi ra tiếng Việt** — phân biệt 3 tình huống: server trả lỗi (`error.response`), không kết nối được (`error.request`), lỗi client. Nhờ vậy mỗi page chỉ cần `catch (err) => setError(err.message)`.

---

## E. MAPPING 5 TASK ↔ MÀN HÌNH ↔ API (2 phút — phần trọng tâm)

| Task | Màn hình FE | API gọi | Method |
|---|---|---|---|
| **Task 1** — Dense Vector Indexing | `IndexPage` | `/api/documents`, `/api/index`, `/api/search-similarity` | GET / POST / POST |
| **Task 2** — RAG vs Non-RAG | `HomePage` | `/api/query` (gọi **2 lần**) | POST |
| **Task 3** — Chunk Size Comparison | `ChunkingComparePanel` | `/api/chunking-compare` | POST |
| **Task 4** — Metadata Filtering | `HomePage` (`QueryForm`) | `/api/query` + `filters` | POST |
| **Task 5** — Embedding Comparison | `EmbeddingComparePanel` | `/api/embedding-compare` | POST |

### Hai chỗ FE "làm thêm việc", nên nhấn mạnh:

**1. Task 2 — Frontend tự dựng bằng chứng Hallucination.**
Backend chỉ có 1 endpoint `/api/query`. `HomePage` gọi nó **hai lần liên tiếp**: lần 1 `use_rag: true`, lần 2 cùng câu hỏi nhưng `use_rag: false`. Hai kết quả được đặt cạnh nhau trong `RagVsNonRagCompare` — khối xanh (có căn cứ pháp lý) vs khối đỏ (LLM tự suy đoán). Bảng so sánh này là sản phẩm của Frontend, không phải backend trả về sẵn.

**2. Task 4 — Làm sạch filter trước khi gửi.**
`QueryForm` có 4 dropdown (loại HĐ / chủ đề / căn cứ pháp lý / đối tượng), mặc định `toan_bo`. Trước khi submit, code lọc bỏ mọi giá trị `toan_bo` rồi mới gửi:

```js
// Chỉ gửi filter người dùng thực sự chọn, tránh backend lọc rỗng ra 0 kết quả
const cleanedFilters = {};
Object.keys(filters).forEach((k) => {
  if (filters[k] && filters[k] !== 'toan_bo') cleanedFilters[k] = filters[k];
});
```

Nếu không làm bước này, `MetadataFilters` của LlamaIndex sẽ tìm giá trị `"toan_bo"` trong ChromaDB → trả về rỗng.

---

## F. UX & TRỰC QUAN HOÁ (45 giây)

- **State pattern lặp lại 4 lần:** `data / loading / error` — nút disable + spinner khi loading, alert đỏ khi error.
- **`useEffect` auto-chạy benchmark** khi mở tab Task 3 & Task 5 → người xem thấy số liệu ngay, không phải bấm.
- **Mã hoá màu ngữ nghĩa:** xanh lá = RAG có căn cứ, đỏ = Non-RAG ảo giác, `badge-score` = điểm cosine similarity, `badge-meta` = metadata, progress bar = Retrieval Precision.
- **4 câu hỏi mẫu bấm-là-điền** kèm sẵn filter tương ứng → demo nhanh, không gõ tay.

---

## G. THAO TÁC DEMO — THỨ TỰ CHUẨN (5–7 phút)

### Chuẩn bị TRƯỚC khi lên (bắt buộc)
- [ ] Backend chạy sẵn: `uvicorn app.main:app --reload --port 8000`, mở `http://localhost:8000/docs` kiểm tra
- [ ] Đã Re-Index xong, ChromaDB có dữ liệu
- [ ] Frontend `npm run dev` chạy sẵn ở `http://localhost:5173`
- [ ] **Bấm thử tab Task 3 và Task 5 một lượt** để model HuggingFace được nạp vào RAM — lần đầu tải model rất lâu, demo trực tiếp sẽ treo
- [ ] Mở sẵn DevTools (F12) ở tab Network
- [ ] Chụp sẵn screenshot mọi màn hình để dự phòng mất mạng

### Kịch bản demo
1. **Mở `localhost:5173`** — giới thiệu navbar 5 tab, mỗi tab là 1 task.
2. **Tab "Tra cứu & RAG"** → bấm câu hỏi mẫu *"Lao động ký hợp đồng 24 tháng… báo trước bao nhiêu ngày?"* → chỉ cho thấy filter **tự động điền theo** → bấm Gửi.
3. Kết quả: `AnswerCard` (câu trả lời + thời gian xử lý) → `RagVsNonRagCompare` (xanh/đỏ) → `SourceList` (Top-3 passage kèm **Similarity Score** và badge metadata).
4. **Mở F12 → Network**: chỉ vào **đúng 2 request POST `/api/query`**, payload khác nhau ở `use_rag`. Nói: *"Bảng so sánh là do Frontend ghép, không phải backend trả sẵn."*
5. **Demo Task 4:** đổi dropdown "Chủ đề" sang **Chế độ thai sản**, gửi lại → chỉ vào Network cho thấy payload có thêm `filters`, và `SourceList` đổi sang passage thai sản.
6. **Tab "Dense Vector Index" (Task 1):** xem danh sách tài liệu + metadata → chạy Top-K Similarity Search → chỉ **Score** và **Latency (ms)**.
7. **Tab "So sánh Chunk Size" (Task 3):** bảng + progress bar Precision.
8. **Tab "So sánh Embedding" (Task 5):** bảng 2 model + phần Recommendation.
9. **(Tuỳ chọn, để CUỐI cùng)** Tắt backend → gửi 1 câu hỏi → hiện alert đỏ tiếng Việt. Chứng minh error handling. **Chỉ làm nếu còn thời gian**, và nhớ bật lại backend.

---

## H. CÂU HỎI KHÓ & CÁCH TRẢ LỜI (chuẩn bị trước)

| Câu hỏi thầy có thể hỏi | Trả lời |
|---|---|
| "Sao không dùng React Router?" | App chỉ 5 màn hình phẳng, không cần deep-link hay URL riêng. `useState` đủ, giảm 1 dependency. Nếu mở rộng có share link thì sẽ thêm router. |
| "Sao Network thấy API gọi 2 lần khi mở tab?" | `React.StrictMode` ở chế độ dev cố tình chạy `useEffect` 2 lần để lộ side-effect. Build production chỉ chạy 1 lần. |
| "Chunk size 512 đâu, sao có 0?" | FE đang gửi `[128, 256, 1024, 0]`; `0` nghĩa là **Unchunked / Full Document** làm mốc đối chứng. (→ **Nên sửa lại thành `[128,256,512,1024]` cho khớp README trước khi nộp.**) |
| "Kết luận '256 tối ưu nhất' và 'bge khuyên dùng' lấy từ đâu?" | Thừa nhận thẳng: hiện đang **hard-code** trong JSX. Hướng sửa đúng là tính `Math.max` theo `precision_percent` / `top_score` từ data trả về rồi gắn badge động. |
| "Vite proxy `/api` có dùng không?" | Không — `axiosClient` gọi thẳng URL tuyệt đối `127.0.0.1:8000`, backend đã bật CORS `allow_origins=["*"]`. Proxy để dự phòng khi deploy cùng origin. |
| "Nếu backend chết thì sao?" | Interceptor bắt `error.request` và hiện thông báo tiếng Việt hướng dẫn kiểm tra Uvicorn — demo được ngay. |

---

## I. SỬA TRƯỚC KHI THUYẾT TRÌNH (3 lỗi nhỏ dễ bị soi)

1. `pages/AboutPage.jsx` ghi `gemini-1.5-flash`, README ghi `gemini-3.6-flash` → **thống nhất 1 tên**.
2. `ChunkingComparePanel.jsx` gửi `chunk_sizes: [128, 256, 1024, 0]` nhưng README nói `128, 256, 512, 1024` → sửa cho khớp.
3. `pages/ComparePage.jsx` tồn tại nhưng **không được import** trong `App.jsx` → xoá file, hoặc giải thích là bản gộp cũ đã tách thành 2 panel riêng.

---

## J. CÂU CHỐT (15 giây)

> "Tóm lại, Frontend là lớp biến kết quả kỹ thuật thành **bằng chứng nhìn thấy được**: điểm similarity, badge metadata, và bảng đối chiếu RAG–NonRAG. Người dùng cuối là HR và người lao động — họ không đọc được JSON, họ cần thấy câu trả lời kèm căn cứ pháp lý."
