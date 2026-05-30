from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class Project(BaseModel):
    id: Optional[UUID] = None
    name: str
    developer: Optional[str] = None
    location: Optional[str] = None
    phase: Optional[str] = "scoping"
    created_at: Optional[datetime] = None