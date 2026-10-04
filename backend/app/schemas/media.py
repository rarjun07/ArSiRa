from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MediaResponse(BaseModel):
    id: int
    file_name: str
    original_name: str
    content_type: str
    file_size: int
    public_url: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
