import React from 'react';

/**
 * Thanh điều hướng.
 * Dùng tab gạch chân thay vì nút bo tròn — quen thuộc với người dùng
 * phần mềm nghiệp vụ và không chiếm nhiều diện tích thị giác.
 */
export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Tra cứu' },
    { id: 'index', label: 'Kho dữ liệu' },
    { id: 'chunking', label: 'So sánh phân đoạn' },
    { id: 'embedding', label: 'So sánh mô hình' },
    { id: 'about', label: 'Giới thiệu' },
  ];

  return (
    <header className="app-header">
      <div className="container" style={{ maxWidth: '1160px' }}>
        {/* Hàng trên: tên hệ thống */}
        <div className="d-flex align-items-baseline gap-2 pt-3">
          <span className="brand">Tra cứu Luật Lao động 2019</span>
          <span className="brand-sub">&amp; Hợp đồng Nhân sự</span>
        </div>

        {/* Hàng dưới: các tab, cuộn ngang được trên màn hình hẹp */}
        <nav className="d-flex overflow-auto" aria-label="Điều hướng chính">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`nav-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
