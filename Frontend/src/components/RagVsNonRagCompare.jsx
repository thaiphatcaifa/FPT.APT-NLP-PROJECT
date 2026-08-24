import React from 'react';

/**
 * Bảng đối chiếu hai chế độ trả lời.
 * Backend chỉ có một endpoint /api/query — bảng này do Frontend dựng
 * bằng cách gọi endpoint đó hai lần với use_rag khác nhau.
 */
export default function RagVsNonRagCompare({ ragResult, nonRagResult }) {
  if (!ragResult && !nonRagResult) return null;

  return (
    <div className="panel mb-3">
      <div className="panel-head">
        <span className="task-tag">Task 2 — Retrieve-then-Generate</span>
        <h2 className="panel-title">Đối chiếu: có tra cứu tài liệu và không tra cứu</h2>
        <p className="panel-desc">
          Cùng một câu hỏi, cùng một mô hình ngôn ngữ. Khác biệt duy nhất là chế độ bên trái
          được đọc văn bản luật trước khi trả lời.
        </p>
      </div>

      <div className="panel-body">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="compare-col">
              <div className="compare-head is-ok">
                <span>Có tra cứu tài liệu</span>
                <span>{ragResult?.execution_time_seconds ?? 0}s</span>
              </div>
              <div className="compare-body">
                <p className="mb-3" style={{ whiteSpace: 'pre-line' }}>
                  {ragResult?.answer || 'Chưa có dữ liệu.'}
                </p>
                <div className="callout" style={{ borderLeftColor: 'var(--ok)', background: 'var(--ok-soft)' }}>
                  Số ngày và mức lương được dẫn từ văn bản có thật, kèm trích dẫn nguồn ở phần dưới.
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="compare-col">
              <div className="compare-head is-err">
                <span>Không tra cứu tài liệu</span>
                <span>{nonRagResult?.execution_time_seconds ?? 0}s</span>
              </div>
              <div className="compare-body">
                <p className="mb-3" style={{ whiteSpace: 'pre-line' }}>
                  {nonRagResult?.answer || 'Chưa có dữ liệu.'}
                </p>
                <div className="callout callout-err">
                  Mô hình trả lời từ trí nhớ, không có văn bản nào chứng minh. Đây là rủi ro pháp lý.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
