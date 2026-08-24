import React from 'react';

/**
 * Thẻ hiển thị câu trả lời của hệ thống.
 * Chế độ trả lời được thể hiện bằng nhãn chữ và màu viền, không dùng
 * biểu tượng cảm xúc.
 */
export default function AnswerCard({ result }) {
  if (!result) return null;

  const { answer, mode, execution_time_seconds, comparison } = result;
  const isRag = mode === 'rag';

  return (
    <div className="panel mb-3">
      <div className="panel-head d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h2 className="panel-title">Kết quả tra cứu</h2>
        <div className="d-flex align-items-center gap-2">
          <span className={`chip mb-0 ${isRag ? 'chip-ok' : 'chip-err'}`}>
            {isRag ? 'Có tra cứu tài liệu' : 'Không tra cứu tài liệu'}
          </span>
          <span className="chip chip-score mb-0">{execution_time_seconds}s</span>
        </div>
      </div>

      <div className="panel-body">
        <p className="answer-text">{answer}</p>

        {comparison && (
          <div className="callout callout-warn mt-3">
            <div className="fw-semibold mb-1">Đối chiếu với chế độ không tra cứu</div>
            <p className="mb-2 text-muted-soft">{comparison.non_rag_answer}</p>
            <p className="mb-0 text-faint" style={{ fontSize: '12.5px' }}>{comparison.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
