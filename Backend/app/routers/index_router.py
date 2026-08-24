from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import IndexRequest, IndexResponse, SimilaritySearchRequest, SimilaritySearchResult
from app.services.indexing_service import indexing_service
from app.utils.logger import logger

router = APIRouter(prefix="/api", tags=["Task 1 - Indexing & Vector Search"])

@router.post("/index", response_model=IndexResponse)
async def build_index(req: IndexRequest = IndexRequest()):
    """Task 1: Tạo Vector Index cho dữ liệu Luật Lao động"""
    try:
        index = indexing_service.get_vector_store_index(reindex=req.reindex)
        documents = indexing_service.get_all_documents()
        return IndexResponse(
            status="success",
            message="Khởi tạo Dense Vector Index thành công với LlamaIndex & ChromaDB!",
            total_documents=len(documents),
            collection_name=indexing_service.collection_name,
            documents=documents
        )
    except Exception as e:
        logger.error(f"Lỗi khởi tạo Vector Index: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khởi tạo Vector Index: {str(e)}")

@router.get("/documents")
async def list_documents():
    """Lấy danh sách các tài liệu pháp lý mẫu và metadata đi kèm"""
    try:
        documents = indexing_service.get_all_documents()
        return {"total": len(documents), "documents": documents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search-similarity", response_model=SimilaritySearchResult)
async def search_similarity(req: SimilaritySearchRequest):
    """Task 1: Đo Top-K Cosine Similarity của Dense Vector Index"""
    try:
        results, exec_time = indexing_service.dense_similarity_search(query=req.query, top_k=req.top_k)
        return SimilaritySearchResult(
            query=req.query,
            results=results,
            execution_time_ms=exec_time
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
