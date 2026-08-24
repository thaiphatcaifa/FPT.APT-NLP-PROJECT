import React, { useState } from 'react';

/**
 * Form nhập câu hỏi kèm bộ lọc metadata.
 * Điểm cần lưu ý: giá trị mặc định 'toan_bo' KHÔNG tồn tại trong metadata
 * của tài liệu nào, nên phải loại bỏ trước khi gửi lên backend.
 */
export default function QueryForm({ onSubmit, loading }) {
  const [question, setQuestion] = useState('');
  const [useRag, setUseRag] = useState(true);
  const [filters, setFilters] = useState({
    loai_hop_dong: 'toan_bo',
    chu_de: 'toan_bo',
    phap_ly: 'toan_bo',
    doi_tuong: 'toan_bo',
  });

  // Câu hỏi mẫu kèm sẵn bộ lọc tương ứng, giúp kiểm thử nhanh
  const sampleQuestions = [
    {
      label: 'Thời hạn báo trước',
      text: 'Lao động ký hợp đồng 24 tháng muốn nghỉ việc thì phải báo trước bao nhiêu ngày?',
      filter: { loai_hop_dong: 'xac_dinh_thoi_han', chu_de: 'cham_dut_hop_dong' },
    },
    {
      label: 'Chế độ thai sản',
      text: 'Chế độ nghỉ thai sản dành cho lao động nữ và nam khi vợ sinh như thế nào?',
      filter: { chu_de: 'thai_san' },
    },
    {
      label: 'Lương làm thêm giờ',
      text: 'Tiền lương làm thêm giờ ngày lễ 30/4 được tính bao nhiêu phần trăm?',
      filter: { chu_de: 'tien_luong_thuong' },
    },
    {
      label: 'Kỷ luật lao động',
      text: 'Quy trình 4 bước tiến hành cuộc họp xử lý kỷ luật lao động gồm những gì?',
      filter: { chu_de: 'ky_luat_lao_dong' },
    },
  ];

  const handleSelectSample = (sample) => {
    setQuestion(sample.text);
    if (sample.filter) {
      setFilters((prev) => ({ ...prev, ...sample.filter }));
    }
  };

  const resetFilters = () =>
    setFilters({ loai_hop_dong: 'toan_bo', chu_de: 'toan_bo', phap_ly: 'toan_bo', doi_tuong: 'toan_bo' });

  // Đếm số bộ lọc đang thực sự áp dụng, để hiển thị cho người dùng biết
  const activeFilterCount = Object.values(filters).filter((v) => v !== 'toan_bo').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Chỉ gửi filter người dùng thực sự chọn.
    // Nếu gửi cả 'toan_bo', LlamaIndex sẽ tìm đúng chuỗi đó trong ChromaDB
    // và trả về kết quả rỗng.
    const cleanedFilters = {};
    Object.keys(filters).forEach((k) => {
      if (filters[k] && filters[k] !== 'toan_bo') {
        cleanedFilters[k] = filters[k];
      }
    });

    onSubmit({
      question: question.trim(),
      use_rag: useRag,
      filters: Object.keys(cleanedFilters).length > 0 ? cleanedFilters : null,
      top_k: 3,
    });
  };

  const selectField = (name, label, options) => (
    <div className="col-6 col-lg-3">
      <label className="field-label" htmlFor={`f-${name}`}>{label}</label>
      <select
        id={`f-${name}`}
        className="field"
        style={{ padding: '7px 9px', fontSize: '13px' }}
        value={filters[name]}
        onChange={(e) => setFilters({ ...filters, [name]: e.target.value })}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.text}</option>
        ))}
      </select>
    </div>
  );

  return (
    <form className="panel mb-3" onSubmit={handleSubmit}>
      <div className="panel-head d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h2 className="panel-title">Câu hỏi tra cứu</h2>

        {/* Công tắc chế độ: nhãn bằng chữ, không dùng biểu tượng cảm xúc */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-faint" style={{ fontSize: '12px' }}>Chế độ</span>
          <div className="btn-group" role="group" aria-label="Chọn chế độ trả lời">
            <button
              type="button"
              className="btn-outline"
              aria-pressed={useRag}
              style={{
                borderRadius: '6px 0 0 6px',
                background: useRag ? 'var(--accent)' : 'var(--bg-surface)',
                color: useRag ? '#fff' : 'var(--fg-muted)',
                borderColor: useRag ? 'var(--accent)' : 'var(--line-strong)',
              }}
              onClick={() => setUseRag(true)}
            >
              Có tra cứu
            </button>
            <button
              type="button"
              className="btn-outline"
              aria-pressed={!useRag}
              style={{
                borderRadius: '0 6px 6px 0',
                marginLeft: '-1px',
                background: !useRag ? 'var(--accent)' : 'var(--bg-surface)',
                color: !useRag ? '#fff' : 'var(--fg-muted)',
                borderColor: !useRag ? 'var(--accent)' : 'var(--line-strong)',
              }}
              onClick={() => setUseRag(false)}
            >
              Không tra cứu
            </button>
          </div>
        </div>
      </div>

      <div className="panel-body">
        <textarea
          className="field"
          rows="3"
          aria-label="Nội dung câu hỏi"
          placeholder="Ví dụ: Người lao động làm thêm giờ vào ngày Tết Nguyên Đán được trả lương bao nhiêu phần trăm?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        {/* Câu hỏi mẫu */}
        <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
          <span className="text-faint" style={{ fontSize: '12px' }}>Câu hỏi mẫu:</span>
          {sampleQuestions.map((q) => (
            <button key={q.label} type="button" className="btn-sample" onClick={() => handleSelectSample(q)}>
              {q.label}
            </button>
          ))}
        </div>

        <hr className="divider" />

        {/* Bộ lọc metadata */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="field-label mb-0">
            Thu hẹp phạm vi tìm kiếm
            {activeFilterCount > 0 && (
              <span className="chip chip-meta ms-2 mb-0">{activeFilterCount} bộ lọc đang áp dụng</span>
            )}
          </span>
          {activeFilterCount > 0 && (
            <button type="button" className="btn-sample" onClick={resetFilters}>Bỏ lọc</button>
          )}
        </div>

        <div className="row g-2">
          {selectField('loai_hop_dong', 'Loại hợp đồng', [
            { value: 'toan_bo', text: 'Tất cả' },
            { value: 'xac_dinh_thoi_han', text: 'Xác định thời hạn' },
            { value: 'khong_xac_dinh_thoi_han', text: 'Không xác định thời hạn' },
          ])}
          {selectField('chu_de', 'Chủ đề', [
            { value: 'toan_bo', text: 'Tất cả' },
            { value: 'cham_dut_hop_dong', text: 'Chấm dứt hợp đồng' },
            { value: 'thai_san', text: 'Chế độ thai sản' },
            { value: 'tien_luong_thuong', text: 'Tiền lương, làm thêm giờ' },
            { value: 'ky_luat_lao_dong', text: 'Kỷ luật lao động' },
          ])}
          {selectField('phap_ly', 'Căn cứ pháp lý', [
            { value: 'toan_bo', text: 'Tất cả' },
            { value: 'Luat_Lao_Dong_2019', text: 'Luật Lao động 2019' },
            { value: 'Luat_Bao_Hiem_Xa_Hoi_2014', text: 'Luật BHXH 2014' },
            { value: 'Nghi_dinh_145_2020', text: 'Nghị định 145/2020' },
          ])}
          {selectField('doi_tuong', 'Đối tượng áp dụng', [
            { value: 'toan_bo', text: 'Tất cả' },
            { value: 'nguoi_lao_dong', text: 'Người lao động' },
            { value: 'nguoi_su_dung_lao_dong', text: 'Người sử dụng lao động' },
          ])}
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button type="submit" className="btn-solid" disabled={loading || !question.trim()}>
            {loading ? (<><span className="spin me-2" />Đang tra cứu…</>) : 'Tra cứu'}
          </button>
        </div>
      </div>
    </form>
  );
}
