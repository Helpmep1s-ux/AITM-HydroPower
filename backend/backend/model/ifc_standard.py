from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class IFCStandard(BaseModel):
    id: Optional[UUID] = None
    ps_number: int
    ps_name: str
    section: Optional[str] = None
    content: str
    embedding: Optional[list[float]] = None