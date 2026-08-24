import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import IndexPage from './pages/IndexPage';
import ChunkingComparePanel from './components/ChunkingComparePanel';
import EmbeddingComparePanel from './components/EmbeddingComparePanel';
import AboutPage from './pages/AboutPage';

/**
 * Component App chính.
 * Ứng dụng có 5 màn hình ngang hàng, không có trang con lồng bên trong,
 * nên điều hướng bằng một biến state là đủ — không cần React Router.
 */
function App() {
  // Tab đang mở. Mặc định là màn hình tra cứu.
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container py-4 flex-grow-1" style={{ maxWidth: '1160px' }}>
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'index' && <IndexPage />}
        {activeTab === 'chunking' && <ChunkingComparePanel />}
        {activeTab === 'embedding' && <EmbeddingComparePanel />}
        {activeTab === 'about' && <AboutPage />}
      </main>

      <footer className="app-footer mt-auto">
        <div className="container d-flex flex-wrap justify-content-between gap-2" style={{ maxWidth: '1160px' }}>
          <span>Hệ thống Tra cứu Luật Lao động 2019 &amp; Hợp đồng Nhân sự</span>
          <span>FastAPI · LlamaIndex · ChromaDB · Gemini · React</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
