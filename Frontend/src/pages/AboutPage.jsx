import React from 'react';

/**
 * Trang giới thiệu kiến trúc hệ thống.
 * Trình bày dạng bảng thông số thay vì các thẻ trang trí, để người đọc
 * đối chiếu nhanh từng thành phần.
 */
export default function AboutPage() {
  const layers = [
    {
      name: 'Lưu trữ vector',
      detail: 'ChromaDB chạy cục bộ, lưu bền trong thư mục Backend/storage/chroma',
      note: 'Không cần dịch vụ đám mây, dữ liệu nằm trên máy',
    },
    {
      name: 'Mô hình biểu diễn văn bản',
      detail: 'all-MiniLM-L6-v2 và bge-small-en-v1.5, đều 384 chiều',
      note: 'Chạy trên CPU, không tốn phí gọi API',
    },
    {
      name: 'Khung điều phối',
      detail: 'LlamaIndex quản lý chỉ mục, bộ truy hồi và bộ lọc metadata',
      note: 'Cắt đoạn, tìm kiếm và lọc đều đi qua lớp này',
    },
    {
      name: 'Mô hình sinh câu trả lời',
      detail: 'Google Gemini (gemini-3.6-flash)',
      note: 'Có cơ chế dự phòng khi mất mạng hoặc thiếu khoá API',
    },
    {
      name: 'Máy chủ',
      detail: 'Python FastAPI, cổng 8000',
      note: 'Tài liệu API tự sinh tại đường dẫn /docs',
    },
    {
      name: 'Giao diện',
      detail: 'React 19 dựng bằng Vite, Bootstrap 5, Axios',
      note: 'Chạy ở cổng 5173',
    },
  ];

  const tasks = [
    ['Task 1', 'Dense Vector Indexing', 'Kho dữ liệu', 'Tạo chỉ mục vector và tìm kiếm theo mức độ tương đồng'],
    ['Task 2', 'Retrieve-then-Generate', 'Tra cứu', 'Đối chiếu trả lời có tra cứu và không tra cứu'],
    ['Task 3', 'Semantic Chunking', 'So sánh phân đoạn', 'Đo ảnh hưởng của kích thước đoạn tới độ chính xác'],
    ['Task 4', 'Metadata Filtering', 'Tra cứu', 'Thu hẹp phạm vi tìm kiếm theo nhãn phân loại'],
    ['Task 5', 'Embedding Comparison', 'So sánh mô hình', 'Đối chiếu hai mô hình biểu diễn văn bản'],
  ];

  return (
    <div>
      <div className="panel mb-3">
        <div className="panel-head">
          <h2 className="panel-title">Hệ thống hoạt động như thế nào</h2>
          <p className="panel-desc">
            Mô hình ngôn ngữ khi trả lời câu hỏi pháp lý thường suy đoán số liệu.
            Hệ thống này buộc mô hình đọc văn bản luật trước khi trả lời, và bắt nó dẫn nguồn.
          </p>
        </div>

        <div className="panel-body">
          <ol className="mb-0 ps-3" style={{ fontSize: '13.5px' }}>
            <li className="mb-2">Người dùng đặt câu hỏi, kèm bộ lọc phạm vi nếu cần.</li>
            <li className="mb-2">Câu hỏi được chuyển thành vector và đem so với toàn bộ kho văn bản.</li>
            <li className="mb-2">Ba đoạn liên quan nhất được lấy ra làm ngữ cảnh.</li>
            <li className="mb-2">Ngữ cảnh và câu hỏi cùng được đưa cho mô hình sinh câu trả lời.</li>
            <li className="mb-0">Câu trả lời hiển thị kèm các đoạn văn bản đã dùng, để người đọc tự kiểm chứng.</li>
          </ol>
        </div>
      </div>

      <div className="panel mb-3">
        <div className="panel-head">
          <h2 className="panel-title">Thành phần hệ thống</h2>
        </div>
        <div className="panel-body p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Lớp</th>
                <th style={{ width: '40%' }}>Công nghệ</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {layers.map((l) => (
                <tr key={l.name}>
                  <td className="fw-semibold">{l.name}</td>
                  <td>{l.detail}</td>
                  <td className="text-muted-soft">{l.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Năm kỹ thuật và vị trí trên giao diện</h2>
        </div>
        <div className="panel-body p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>Mã</th>
                <th style={{ width: '25%' }}>Kỹ thuật</th>
                <th style={{ width: '20%' }}>Màn hình</th>
                <th>Nội dung</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t[0]}>
                  <td className="fw-semibold">{t[0]}</td>
                  <td>{t[1]}</td>
                  <td className="text-muted-soft">{t[2]}</td>
                  <td className="text-muted-soft">{t[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
