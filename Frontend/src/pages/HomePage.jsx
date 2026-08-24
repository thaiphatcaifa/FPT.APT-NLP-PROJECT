import React, { useState } from 'react';
import QueryForm from '../components/QueryForm';
import AnswerCard from '../components/AnswerCard';
import SourceList from '../components/SourceList';
import RagVsNonRagCompare from '../components/RagVsNonRagCompare';
import axiosClient from '../api/axiosClient';

/**
 * Màn hình tra cứu chính (Task 2 và Task 4).
 * Gửi câu hỏi kèm bộ lọc metadata, đồng thời gọi thêm một lần ở chế độ
 * không tra cứu để dựng bảng đối chiếu.
 */
export default function HomePage() {
  const [result, setResult] = useState(null);
  const [nonRagResult, setNonRagResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuery = async (queryPayload) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setNonRagResult(null);

    try {
      // Lần 1: chế độ người dùng đã chọn
      const ragRes = await axiosClient.post('/api/query', queryPayload);
      setResult(ragRes);

      // Lần 2: nếu đang bật RAG thì gọi thêm bản không RAG để đối chiếu
      if (queryPayload.use_rag) {
        const nonRagRes = await axiosClient.post('/api/query', {
          ...queryPayload,
          use_rag: false,
        });
        setNonRagResult(nonRagRes);
      }
    } catch (err) {
      setError(err.message || 'Không thể kết nối tới máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const hasNothingYet = !loading && !error && !result;

  return (
    <div>
      <QueryForm onSubmit={handleQuery} loading={loading} />

      {error && (
        <div className="callout callout-err mb-3">
          <div className="fw-semibold mb-1">Không thực hiện được truy vấn</div>
          <div>{error}</div>
        </div>
      )}

      {/* Trạng thái rỗng: hướng dẫn người dùng bước tiếp theo */}
      {hasNothingYet && (
        <div className="panel">
          <div className="empty-state">
            <i className="bi bi-search empty-icon" aria-hidden="true" />
            <div className="empty-title">Chưa có truy vấn nào</div>
            <div className="empty-hint">
              Nhập câu hỏi ở trên, hoặc chọn một câu hỏi mẫu để xem hệ thống hoạt động.
            </div>
          </div>
        </div>
      )}

      {result && <AnswerCard result={result} />}

      {result && result.mode === 'rag' && nonRagResult && (
        <RagVsNonRagCompare ragResult={result} nonRagResult={nonRagResult} />
      )}

      {result && result.sources && <SourceList sources={result.sources} />}
    </div>
  );
}
