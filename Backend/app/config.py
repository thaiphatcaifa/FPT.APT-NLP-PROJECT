import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(dotenv_path=BASE_DIR / "Backend" / ".env")
load_dotenv(dotenv_path=BASE_DIR / ".env")

class Settings:
    PROJECT_NAME: str = "Hệ thống Tra cứu Luật Lao động & Hợp đồng Nhân sự (RAG + LlamaIndex)"
    VERSION: str = "1.0.0"
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "gemini-3.6-flash")
    
    # Embedding Settings
    EMBEDDING_MODEL_DEFAULT: str = os.getenv("EMBEDDING_MODEL_DEFAULT", "sentence-transformers/all-MiniLM-L6-v2")
    EMBEDDING_MODEL_ALT: str = os.getenv("EMBEDDING_MODEL_ALT", "BAAI/bge-small-en-v1.5")
    
    # Paths
    BASE_DIR: Path = BASE_DIR
    DATA_DIR: Path = BASE_DIR / "Backend" / "data"
    STORAGE_DIR: Path = BASE_DIR / "Backend" / "storage" / "chroma"
    COLLECTION_NAME: str = os.getenv("COLLECTION_NAME", "luat_lao_dong_collection")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

settings = Settings()
