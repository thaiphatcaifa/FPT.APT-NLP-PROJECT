import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const MODELS = [
  'sentence-transformers/all-MiniLM-L6-v2',
  'BAAI/bge-small-en-v1.5',
];

// Rút gọn tên mô hình cho dễ đọc, giữ tên đầy đủ ở dòng phụ
const shortName = (name) => name.split('/').pop();

/**
 * So sánh hai mô hình biểu diễn văn bản thành vector (Task 5).
 * Nhãn "phù hợp hơn" được tính từ điểm số backend trả về, không gán cứng.
 */
export default function EmbeddingComparePanel() {
  const [query, setQuery] = useState('Nữ lao động sinh con được nghỉ chế độ thai sản bao lâu?');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmbeddingCompare = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.post('/api/embedding-compare', {
        query,
        models: MODELS,
      });
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmbeddingCompare();
    // Chỉ chạy một lần khi mở màn hình
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mô hình có điểm tương đồng cao nhất trong lần đo này
  const bestModel = data?.results?.length
    ? data.results.reduce((best, r) => (r.top_score > best.top_score ? r : best)).model_name
    : null;

  return (
    <div>
      <div className="panel mb-3">
        <div className="panel-head">
          <span className="task-tag">Task 5 — Embedding Comparison</span>
          <h2 className="panel-title">So sánh hai mô hình biểu diễn văn bản</h2>
          <p className="panel-desc">
            Cùng một câu hỏi, đo thời gian xử lý và mức độ tìm đúng đoạn văn bản của từng mô hình.
          </p>
        </div>

        <div className="panel-body">
          <div className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="field"
              aria-label="Câu hỏi dùng để đo"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập câu hỏi dùng để đo…"
            />
            <button className="btn-solid" onClick={fetchEmbeddingCompare} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
              {loading ? (<><span className="spin me-2" />Đang đo…</>) : 'Chạy lại'}
            </button>
          </div>

          {error && <div className="callout callout-err mb-3">{error}</div>}

          {loading && !data && <div className="text-faint">Đang nạp và đo {MODELS.length} mô hình…</div>}

          {data && (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mô hình</th>
                    <th className="col-num">Số chiều vector</th>
                    <th className="col-num">Thời gian nạp</th>
                    <th className="col-num">Thời gian tìm</th>
                    <th className="col-num">Điểm tương đồng</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((r, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="fw-semibold">
                          {shortName(r.model_name)}
                          {r.model_name === bestModel && (
                            <span className="chip chip-ok ms-2 mb-0">Phù hợp hơn</span>
                          )}
                        </div>
                        <div className="text-faint" style={{ fontSize: '11.5px' }}>{r.model_name}</div>
                      </td>
                      <td className="col-num">{r.dimension}</td>
                      <td className="col-num">{r.indexing_time_ms} ms</td>
                      <td className="col-num">{r.retrieval_time_ms} ms</td>
                      <td className="col-num">{r.top_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data?.recommendation && (
            <div className="callout callout-info mt-3">
              <div className="fw-semibold mb-1">Nhận xét</div>
              <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{data.recommendation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Đoạn văn bản mỗi mô hình tìm được */}
      {data && (
        <div className="row g-3">
          {data.results.map((r, idx) => (
            <div className="col-md-6" key={idx}>
              <div className="panel h-100">
                <div className="panel-head">
                  <span className="fw-semibold">{shortName(r.model_name)}</span>
                </div>
                <div className="panel-body">
                  <div className="field-label">Đoạn văn bản tìm được</div>
                  <p className="source-text mb-0">{r.retrieved_text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
