import json
from typing import List, Dict, Any
from app.config import settings

class MetadataService:
    def __init__(self):
        self.metadata_file = settings.DATA_DIR / "metadata.json"

    def get_metadata_schema(self) -> Dict[str, Any]:
        return {
            "loai_hop_dong": {
                "label": "Loại hợp đồng lao động",
                "options": [
                    {"value": "toan_bo", "label": "Tất cả loại hợp đồng"},
                    {"value": "xac_dinh_thoi_han", "label": "Hợp đồng xác định thời hạn"},
                    {"value": "khong_xac_dinh_thoi_han", "label": "Hợp đồng không xác định thời hạn"}
                ]
            },
            "chu_de": {
                "label": "Chủ đề quy định",
                "options": [
                    {"value": "toan_bo", "label": "Tất cả chủ đề"},
                    {"value": "cham_dut_hop_dong", "label": "Chấm dứt hợp đồng"},
                    {"value": "thai_san", "label": "Chế độ thai sản"},
                    {"value": "tien_luong_thuong", "label": "Tiền lương & Làm thêm giờ"},
                    {"value": "ky_luat_lao_dong", "label": "Kỷ luật lao động"}
                ]
            },
            "phap_ly": {
                "label": "Căn cứ pháp lý",
                "options": [
                    {"value": "toan_bo", "label": "Tất cả văn bản pháp lý"},
                    {"value": "Luat_Lao_Dong_2019", "label": "Bộ luật Lao động 2019"},
                    {"value": "Luat_Bao_Hiem_Xa_Hoi_2014", "label": "Luật Bảo hiểm xã hội 2014"},
                    {"value": "Nghi_dinh_145_2020", "label": "Nghị định 145/2020/NĐ-CP"}
                ]
            },
            "doi_tuong": {
                "label": "Đối tượng áp dụng",
                "options": [
                    {"value": "toan_bo", "label": "Tất cả đối tượng"},
                    {"value": "nguoi_lao_dong", "label": "Người lao động"},
                    {"value": "nguoi_su_dung_lao_dong", "label": "Người sử dụng lao động (DN)"},
                    {"value": "toan_the", "label": "Toàn thể người lao động & DN"}
                ]
            }
        }

    def get_document_metadata_list(self) -> List[Dict[str, Any]]:
        if self.metadata_file.exists():
            with open(self.metadata_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

metadata_service = MetadataService()
