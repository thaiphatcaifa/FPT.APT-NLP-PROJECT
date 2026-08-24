import React from 'react';

// Đổi khoá metadata kỹ thuật sang nhãn tiếng Việt cho người dùng cuối
const META_LABEL = {
  loai_hop_dong: 'Loại hợp đồng',
  chu_de: 'Chủ đề',
  phap_ly: 'Căn cứ pháp lý',
  doi_tuong: 'Đối tượng',
  dieu_luat: 'Điều luật',
};

// Đổi giá trị dạng snake_case sang chữ đọc được
const humanize = (v) =>
  String(v).replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/**
 * Danh sách đoạn văn bản gốc được hệ thống trích ra làm căn cứ trả lời.
 */
export default function SourceList({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="panel mb-3">
      <div className="panel-head d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h2 className="panel-title">Căn cứ pháp lý được trích dẫn</h2>
          <p className="panel-desc">
            Các đoạn văn bản hệ thống đã đọc trước khi trả lời, xếp theo mức độ liên quan.
          </p>
        </div>
        <span className="chip chip-score mb-0">{sources.length} đoạn</span>
      </div>

      <div className="panel-body">
        {sources.map((src, idx) => (
          <div className="source-item" key={src.node_id || idx}>
            <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
              <div>
                <div className="fw-semibold">{src.title || src.file_name}</div>
                <div className="text-faint" style={{ fontSize: '12px' }}>{src.file_name}</div>
              </div>
              <span className="chip chip-score mb-0" title="Mức độ liên quan giữa câu hỏi và đoạn văn bản">
                Liên quan {src.score}
              </span>
            </div>

            {src.metadata && Object.keys(src.metadata).length > 0 && (
              <div className="mb-2">
                {Object.entries(src.metadata).map(([k, v]) => (
                  <span className="chip chip-meta" key={k}>
                    {META_LABEL[k] || k}: {humanize(v)}
                  </span>
                ))}
              </div>
            )}

            <p className="source-text">{src.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
