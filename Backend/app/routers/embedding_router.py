from fastapi import APIRouter, HTTPException
from app.models.schemas import EmbeddingCompareRequest, EmbeddingCompareResponse
from app.services.embedding_service import embedding_service
from app.utils.logger import logger

# APIRouter cho Task 5: So sánh đối sánh các mô hình Embedding
router = APIRouter(prefix="/api", tags=["Task 5 - Embedding Model Comparison"])

@router.post("/embedding-compare", response_model=EmbeddingCompareResponse)
async def compare_embedding(req: EmbeddingCompareRequest = EmbeddingCompareRequest()):
    """
    Task 5 Endpoint:
    So sánh hiệu năng và chất lượng biểu diễn của 2 mô hình Embedding HuggingFace:
    1. sentence-transformers/all-MiniLM-L6-v2 (Mặc định)
    2. BAAI/bge-small-en-v1.5 (Thay thế)
    Đo lường thời gian tạo véc-tơ, độ trễ truy vấn (Latency) và điểm tương đồng Similarity Score.
    """
    try:
        results = embedding_service.compare_embedding_models(
            query=req.query,
            models=req.models
        )
        return results
    except Exception as e:
        logger.error(f"Lỗi thực nghiệm Embedding: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi thực nghiệm Embedding: {str(e)}")
