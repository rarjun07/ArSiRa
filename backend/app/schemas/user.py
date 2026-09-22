from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserPublic(BaseModel):
    id: int
    email: str
    username: str
    full_name: str | None
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
