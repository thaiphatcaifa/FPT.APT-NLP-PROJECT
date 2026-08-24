import os
import json
import time
from typing import List, Dict, Any, Tuple
# pyrefly: ignore [missing-import]
import chromadb
# pyrefly: ignore [missing-import]
from llama_index.core import Document, VectorStoreIndex, StorageContext, Settings as LlamaSettings
# pyrefly: ignore [missing-import]
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
# pyrefly: ignore [missing-import]
from llama_index.vector_stores.chroma import ChromaVectorStore

from app.config import settings
from app.utils.logger import logger
from app.models.schemas import DocumentItem, SourceNode

_embedding_model_cache = {}

def get_embedding_model(model_name: str = None):
    if model_name is None:
        model_name = settings.EMBEDDING_MODEL_DEFAULT
    if model_name not in _embedding_model_cache:
        logger.info(f"Đang nạp Embedding Model: {model_name}...")
        _embedding_model_cache[model_name] = HuggingFaceEmbedding(model_name=model_name)
    return _embedding_model_cache[model_name]

class IndexingService:
    def __init__(self):
        self.data_dir = settings.DATA_DIR
        self.storage_dir = settings.STORAGE_DIR
        self.collection_name = settings.COLLECTION_NAME
        self.embedding_model = get_embedding_model()
        LlamaSettings.embed_model = self.embedding_model

    def _load_raw_documents(self) -> List[Document]:
        metadata_file = self.data_dir / "metadata.json"
        metadata_map = {}
        if metadata_file.exists():
            with open(metadata_file, "r", encoding="utf-8") as f:
                metadata_list = json.load(f)
                for item in metadata_list:
                    metadata_map[item["file_name"]] = item

        documents = []
        for file_path in self.data_dir.glob("*.txt"):
            file_name = file_path.name
            with open(file_path, "r", encoding="utf-8") as f:
                text_content = f.read()

            meta_info = metadata_map.get(file_name, {})
            meta_dict = meta_info.get("metadata", {})
            title = meta_info.get("title", file_name)

            doc = Document(
                text=text_content,
                doc_id=file_name,
                metadata={
                    "file_name": file_name,
                    "title": title,
                    **meta_dict
                }
            )
            documents.append(doc)
        return documents

    def get_all_documents(self) -> List[DocumentItem]:
        raw_docs = self._load_raw_documents()
        items = []
        for doc in raw_docs:
            items.append(
                DocumentItem(
                    file_name=doc.metadata.get("file_name", ""),
                    title=doc.metadata.get("title", ""),
                    content=doc.text,
                    metadata={k: v for k, v in doc.metadata.items() if k not in ["file_name", "title"]}
                )
            )
        return items

    def get_vector_store_index(self, reindex: bool = False, model_name: str = None) -> VectorStoreIndex:
        embed_model = get_embedding_model(model_name)
        LlamaSettings.embed_model = embed_model
        
        db_path = str(self.storage_dir)
        os.makedirs(db_path, exist_ok=True)
        chroma_client = chromadb.PersistentClient(path=db_path)
        
        coll_name = self.collection_name
        if model_name and model_name != settings.EMBEDDING_MODEL_DEFAULT:
            coll_name = f"{self.collection_name}_{model_name.replace('/', '_').replace('-', '_')}"
            
        if reindex:
            try:
                chroma_client.delete_collection(coll_name)
                logger.info(f"Đã xóa collection cũ: {coll_name}")
            except Exception:
                pass

        chroma_collection = chroma_client.get_or_create_collection(coll_name)
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        if chroma_collection.count() == 0 or reindex:
            logger.info("Collection trống hoặc yêu cầu reindex. Đang tạo Vector Index mới...")
            documents = self._load_raw_documents()
            index = VectorStoreIndex.from_documents(
                documents,
                storage_context=storage_context,
                embed_model=embed_model
            )
        else:
            logger.info(f"Sử dụng Vector Index sẵn có trong ChromaDB collection: {coll_name}")
            index = VectorStoreIndex.from_vector_store(
                vector_store,
                embed_model=embed_model
            )
        return index

    def dense_similarity_search(self, query: str, top_k: int = 3, model_name: str = None) -> Tuple[List[SourceNode], float]:
        start_time = time.time()
        index = self.get_vector_store_index(model_name=model_name)
        retriever = index.as_retriever(similarity_top_k=top_k)
        retrieved_nodes = retriever.retrieve(query)
        execution_time_ms = (time.time() - start_time) * 1000

        results = []
        for node in retrieved_nodes:
            metadata = node.node.metadata or {}
            results.append(
                SourceNode(
                    node_id=node.node.node_id,
                    text=node.node.get_content(),
                    score=round(float(node.score or 0.0), 4),
                    file_name=metadata.get("file_name", "N/A"),
                    title=metadata.get("title", "N/A"),
                    metadata={k: v for k, v in metadata.items() if k not in ["file_name", "title"]}
                )
            )
        return results, round(execution_time_ms, 2)

indexing_service = IndexingService()
