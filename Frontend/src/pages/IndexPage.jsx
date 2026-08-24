import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const META_LABEL = {
  loai_hop_dong: 'Loại hợp đồng',
  chu_de: 'Chủ đề',
  phap_ly: 'Căn cứ pháp lý',
  doi_tuong: 'Đối tượng',
  dieu_luat: 'Điều luật',
};

const humanize = (v) => String(v).replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/**
 * Màn hình quản lý kho dữ liệu (Task 1).
 * Xem danh sách văn bản đã nạp và thử tìm kiếm theo mức độ tương đồng.
 */
export default function IndexPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reindexing, setReindexing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('thời hạn báo trước 30 ngày 45 ngày');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/documents');
      setDocuments(res.documents || []);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleReindex = async () => {
    // Nạp lại toàn bộ mất vài phút, nên hỏi xác nhận trước
    const ok = window.confirm(
      'Thao tác này xoá toàn bộ chỉ mục hiện có và nạp lại từ đầu. Quá trình có thể mất vài phút. Tiếp tục?'
    );
    if (!ok) return;

    setReindexing(true);
    setMessage('');
    try {
      const res = await axiosClient.post('/api/index', { reindex: true });
      setMessage(res.message);
      fetchDocuments();
    } catch (err) {
      setMessage(`Không nạp lại được: ${err.message}`);
    } finally {
      setReindexing(false);
    }
  };

  const handleSimilaritySearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await axiosClient.post('/api/search-similarity', {
        query: searchQuery,
        top_k: 3,
      });
      setSearchResults(res);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div>
      {/* Danh sách tài liệu */}
      <div className="panel mb-3">
        <div className="panel-head d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <span className="task-tag">Task 1 — Dense Vector Indexing</span>
            <h2 className="panel-title">Kho văn bản pháp luật</h2>
            <p className="panel-desc">
              Các văn bản đã được chuyển thành vector và lưu trong cơ sở dữ liệu ChromaDB.
            </p>
          </div>
          <button className="btn-outline" onClick={handleReindex} disabled={reindexing}>
            {reindexing ? (<><span className="spin spin-dark me-2" />Đang nạp lại…</>) : 'Nạp lại toàn bộ'}
          </button>
        </div>

        <div className="panel-body">
          {message && <div className="callout callout-info mb-3">{message}</div>}

          {loading && <div className="text-faint">Đang tải danh sách…</div>}

          {!loading && documents.length === 0 && (
            <div className="empty-state">
              <i className="bi bi-inbox empty-icon" aria-hidden="true" />
              <div className="empty-title">Kho dữ liệu đang trống</div>
              <div className="empty-hint">Bấm “Nạp lại toàn bộ” để đọc các văn bản trong thư mục dữ liệu.</div>
            </div>
          )}

          {documents.length > 0 && (
            <>
              <div className="text-faint mb-2" style={{ fontSize: '12.5px' }}>
                {documents.length} văn bản đang lưu trữ
              </div>
              <div className="row g-3">
                {documents.map((doc, idx) => (
                  <div className="col-md-6" key={idx}>
                    <div className="source-item h-100 mb-0">
                      <div className="fw-semibold mb-1">{doc.title || doc.file_name}</div>
                      <div className="text-faint mb-2" style={{ fontSize: '12px' }}>{doc.file_name}</div>

                      {doc.metadata && (
                        <div className="mb-2">
                          {Object.entries(doc.metadata).map(([k, v]) => (
                            <span className="chip chip-meta" key={k}>
                              {META_LABEL[k] || k}: {humanize(v)}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="source-text" style={{ maxHeight: '96px', overflowY: 'auto' }}>
                        {doc.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thử nghiệm tìm kiếm tương đồng */}
      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Thử tìm kiếm theo mức độ tương đồng</h2>
          <p className="panel-desc">
            Nhập một câu bất kỳ để xem hệ thống tìm ra ba đoạn văn bản gần nghĩa nhất, kèm điểm số và thời gian xử lý.
          </p>
        </div>

        <div className="panel-body">
          <form onSubmit={handleSimilaritySearch} className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="field"
              aria-label="Câu truy vấn thử nghiệm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập câu truy vấn…"
            />
            <button className="btn-solid" type="submit" disabled={searchLoading} style={{ whiteSpace: 'nowrap' }}>
              {searchLoading ? (<><span className="spin me-2" />Đang đo…</>) : 'Tìm kiếm'}
            </button>
          </form>

          {!searchResults && !searchLoading && (
            <div className="text-faint" style={{ fontSize: '12.5px' }}>
              Chưa chạy thử nghiệm nào.
            </div>
          )}

          {searchResults && (
            <>
              <div className="text-faint mb-2" style={{ fontSize: '12.5px' }}>
                Trả về {searchResults.results.length} kết quả trong {searchResults.execution_time_ms} mili giây
              </div>
              {searchResults.results.map((res, idx) => (
                <div className="source-item" key={idx}>
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-1">
                    <div className="fw-semibold">
                      <span className="text-faint me-2">{idx + 1}.</span>
                      {res.title}
                    </div>
                    <span className="chip chip-score mb-0">Liên quan {res.score}</span>
                  </div>
                  <div className="text-muted-soft" style={{ fontSize: '13px' }}>
                    {res.text.substring(0, 180)}…
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
