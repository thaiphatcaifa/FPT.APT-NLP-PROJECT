from fastapi import APIRouter, HTTPException
from app.models.schemas import ChunkCompareRequest, ChunkCompareResponse
from app.services.chunking_service import chunking_service
from app.utils.logger import logger

router = APIRouter(prefix="/api", tags=["Task 3 - Semantic Chunking Comparison"])

@router.post("/chunking-compare", response_model=ChunkCompareResponse)
async def compare_chunking(req: ChunkCompareRequest = ChunkCompareRequest()):
    """Task 3: So sánh hiệu năng và độ chính xác của các Chunk Size khác nhau (128 vs 256 vs 1024 vs Unchunked)"""
    try:
        results = chunking_service.compare_chunk_sizes(
            query=req.query,
            chunk_sizes=req.chunk_sizes
        )
        return results
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=404, detail=str(fnf))
    except Exception as e:
        logger.error(f"Lỗi thực nghiệm Chunking: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi thực nghiệm Chunking: {str(e)}")
