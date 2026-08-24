import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

// Bốn kích thước phân đoạn được so sánh. Giữ đúng như mô tả trong README.
const CHUNK_SIZES = [128, 256, 512, 1024];

/**
 * So sánh hiệu quả phân đoạn văn bản theo kích thước (Task 3).
 * Kết luận "tốt nhất" được tính từ dữ liệu backend trả về, không gán cứng.
 */
export default function ChunkingComparePanel() {
  const [query, setQuery] = useState('Quy trình 4 bước tiến hành cuộc họp xử lý kỷ luật lao động gồm những gì?');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChunkingCompare = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.post('/api/chunking-compare', {
        query,
        chunk_sizes: CHUNK_SIZES,
      });
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChunkingCompare();
    // Chỉ chạy một lần khi mở màn hình
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRun = (e) => {
    e.preventDefault();
    fetchChunkingCompare();
  };

  // Tìm cấu hình có độ chính xác cao nhất trong chính dữ liệu vừa nhận
  const bestChunkSize = data?.results?.length
    ? data.results.reduce((best, r) => (r.precision_percent > best.precision_percent ? r : best)).chunk_size
    : null;

  const labelOf = (size) => (size > 0 ? `${size} token` : 'Giữ nguyên toàn văn');

  return (
    <div>
      <div className="panel mb-3">
        <div className="panel-head d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <span className="task-tag">Task 3 — Semantic Chunking</span>
            <h2 className="panel-title">So sánh kích thước phân đoạn</h2>
            <p className="panel-desc">
              Cắt văn bản dài về kỷ luật lao động thành các đoạn với kích thước khác nhau,
              rồi đo xem cấu hình nào giúp tìm đúng thông tin hơn.
            </p>
          </div>
        </div>

        <div className="panel-body">
          <form onSubmit={handleRun} className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="field"
              aria-label="Câu hỏi dùng để đo"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập câu hỏi dùng để đo…"
            />
            <button type="submit" className="btn-solid" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
              {loading ? (<><span className="spin me-2" />Đang đo…</>) : 'Chạy lại'}
            </button>
          </form>

          {error && <div className="callout callout-err mb-3">{error}</div>}

          {loading && !data && <div className="text-faint">Đang chạy thử nghiệm trên {CHUNK_SIZES.length} cấu hình…</div>}

          {data && (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Kích thước đoạn</th>
                    <th className="col-num">Số đoạn</th>
                    <th className="col-num">Độ dài trung bình</th>
                    <th className="col-num">Thời gian tìm</th>
                    <th className="col-num">Điểm cao nhất</th>
                    <th className="col-num">Độ chính xác</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((r, idx) => (
                    <tr key={idx}>
                      <td>
                        {labelOf(r.chunk_size)}
                        {r.chunk_size === bestChunkSize && (
                          <span className="chip chip-ok ms-2 mb-0">Tốt nhất</span>
                        )}
                      </td>
                      <td className="col-num">{r.total_chunks}</td>
                      <td className="col-num">{r.avg_chunk_char_length} ký tự</td>
                      <td className="col-num">{r.retrieval_time_ms} ms</td>
                      <td className="col-num">{r.top_score}</td>
                      <td className="col-num">
                        <div className="meter">
                          <div className="meter-track">
                            <div className="meter-fill" style={{ width: `${r.precision_percent}%` }} />
                          </div>
                          <span className="meter-value">{r.precision_percent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Chi tiết từng cấu hình */}
      {data && (
        <div className="row g-3">
          {data.results.map((r, idx) => (
            <div className="col-md-6" key={idx}>
              <div className="panel h-100">
                <div className="panel-head d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">{labelOf(r.chunk_size)}</span>
                  <span className="chip chip-score mb-0">{r.precision_percent}%</span>
                </div>
                <div className="panel-body">
                  <div className="field-label">Đoạn văn bản được lấy ra</div>
                  <p className="source-text mb-3">{r.retrieved_text}</p>

                  <div className="field-label">Câu trả lời sinh ra</div>
                  <p className="mb-0" style={{ whiteSpace: 'pre-line', fontSize: '13px' }}>
                    {r.generated_answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
