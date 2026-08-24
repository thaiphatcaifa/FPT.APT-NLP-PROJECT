from contextlib import asynccontextmanager
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.utils.logger import logger
from app.routers import index_router, query_router, chunking_router, embedding_router
from app.services.indexing_service import indexing_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=== Khởi động Hệ thống Tra cứu Luật Lao động & Hợp đồng Nhân sự ===")
    try:
        # Khởi tạo hoặc kiểm tra Vector Index ban đầu
        indexing_service.get_vector_store_index(reindex=False)
        logger.info("Vector Index sẵn sàng!")
    except Exception as e:
        logger.warning(f"Cảnh báo khi khởi tạo Vector Index lúc startup: {str(e)}")
    yield
    logger.info("=== Tắt hệ thống Backend ===")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Hệ thống Trợ lý AI Tra cứu Luật Lao động 2019 & Hợp đồng Nhân sự sử dụng RAG + LlamaIndex",
    lifespan=lifespan
)

# Cấu hình CORS cho phép mọi nguồn (Origin) từ Frontend gọi API không bị chặn
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các API Routers
app.include_router(index_router.router)
app.include_router(query_router.router)
app.include_router(chunking_router.router)
app.include_router(embedding_router.router)

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

@app.get("/")
async def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "tasks": [
            "Task 1 - Dense Vector Indexing & Top-K Search (/api/index, /api/search-similarity)",
            "Task 2 - Retrieve-then-Generate RAG vs Non-RAG (/api/query)",
            "Task 3 - Semantic Chunking Comparison (/api/chunking-compare)",
            "Task 4 - Metadata Filtering (/api/query with filters, /api/metadata-schema)",
            "Task 5 - Embedding Model Comparison (/api/embedding-compare)"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
