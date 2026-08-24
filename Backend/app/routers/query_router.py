from fastapi import APIRouter, HTTPException
from app.models.schemas import QueryRequest, QueryResponse
from app.services.rag_service import rag_service
from app.services.metadata_service import metadata_service
from app.utils.logger import logger

router = APIRouter(prefix="/api", tags=["Task 2 & 4 - RAG Pipeline & Metadata Filtering"])

@router.post("/query", response_model=QueryResponse)
async def process_query(req: QueryRequest):
    """Task 2 & Task 4: Tra cứu RAG với LlamaIndex, hỗ trợ Metadata Filter và so sánh Non-RAG"""
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="Câu hỏi không được để trống!")
    
    try:
        response = rag_service.execute_rag(
            question=req.question.strip(),
            use_rag=req.use_rag,
            filters_dict=req.filters,
            top_k=req.top_k
        )
        return response
    except Exception as e:
        logger.error(f"Lỗi xử lý query RAG: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống RAG: {str(e)}")

@router.get("/metadata-schema")
async def get_metadata_schema():
    """Task 4: Lấy danh mục các trường Metadata có cấu trúc để làm bộ lọc UI"""
    try:
        return metadata_service.get_metadata_schema()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
