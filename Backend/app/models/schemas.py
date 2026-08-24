from typing import Optional, Any, Dict, List
from pydantic import BaseModel, Field

class MetadataFilterInput(BaseModel):
    loai_hop_dong: Optional[str] = Field(None, description="Loại hợp đồng: xac_dinh_thoi_han | khong_xac_dinh_thoi_han | toan_bo")
    chu_de: Optional[str] = Field(None, description="Chủ đề: cham_dut_hop_dong | thai_san | tien_luong_thuong | ky_luat_lao_dong")
    phap_ly: Optional[str] = Field(None, description="Văn bản pháp lý quy định")
    doi_tuong: Optional[str] = Field(None, description="Đối tượng áp dụng: nguoi_lao_dong | nguoi_su_dung_lao_dong | toan_the")

class SourceNode(BaseModel):
    node_id: str
    text: str
    score: float
    file_name: str
    title: str
    metadata: Dict[str, Any]

class QueryRequest(BaseModel):
    question: str = Field(..., example="Lao động ký hợp đồng 24 tháng muốn nghỉ việc thì phải báo trước bao nhiêu ngày?")
    use_rag: bool = Field(True, description="True để dùng RAG, False để dùng Direct LLM")
    filters: Optional[Dict[str, Any]] = Field(None, description="Bộ lọc Metadata (Task 4)")
    top_k: int = Field(3, ge=1, le=10, description="Số lượng passage liên quan nhất")

class NonRagComparison(BaseModel):
    answer: str
    note: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceNode]
    mode: str = Field(..., description="'rag' hoặc 'no_rag'")
    execution_time_seconds: float
    comparison: Optional[Dict[str, Any]] = None

class IndexRequest(BaseModel):
    reindex: bool = Field(False, description="True nếu muốn xóa index cũ và re-index lại từ đầu")

class DocumentItem(BaseModel):
    file_name: str
    title: str
    content: str
    metadata: Dict[str, Any]

class IndexResponse(BaseModel):
    status: str
    message: str
    total_documents: int
    collection_name: str
    documents: List[DocumentItem]

class SimilaritySearchRequest(BaseModel):
    query: str
    top_k: int = 3

class SimilaritySearchResult(BaseModel):
    query: str
    results: List[SourceNode]
    execution_time_ms: float

class ChunkMetrics(BaseModel):
    chunk_size: int
    total_chunks: int
    avg_chunk_char_length: float
    retrieval_time_ms: float
    top_score: float
    precision_percent: float
    retrieved_text: str
    generated_answer: str

class ChunkCompareRequest(BaseModel):
    query: str = Field("Quy trình 4 bước tiến hành cuộc họp xử lý kỷ luật lao động gồm những gì?", description="Câu hỏi kiểm thử cho Task 3")
    chunk_sizes: List[int] = Field([128, 256, 1024, 0], description="0 đại diện cho Unchunked / Full Document")

class ChunkCompareResponse(BaseModel):
    document_name: str
    query: str
    results: List[ChunkMetrics]

class EmbeddingMetrics(BaseModel):
    model_name: str
    dimension: int
    indexing_time_ms: float
    retrieval_time_ms: float
    top_score: float
    retrieved_text: str

class EmbeddingCompareRequest(BaseModel):
    query: str = Field("Nữ lao động sinh con được nghỉ chế độ thai sản bao lâu?", description="Câu hỏi kiểm thử Task 5")
    models: List[str] = Field(
        ["sentence-transformers/all-MiniLM-L6-v2", "BAAI/bge-small-en-v1.5"],
        description="Danh sách 2 embedding models để so sánh"
    )

class EmbeddingCompareResponse(BaseModel):
    query: str
    results: List[EmbeddingMetrics]
    recommendation: str
