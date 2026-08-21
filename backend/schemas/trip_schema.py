from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TripBase(BaseModel):
    destination: str
    days: int
    budget: float
    # Optional field if user passes it from frontend for AI generation
    travel_style: Optional[str] = "Standard"

class TripCreate(TripBase):
    pass

class TripResponse(TripBase):
    id: int
    daily_budget: float
    category: str
    ai_recommendation: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TripGenerateRequest(BaseModel):
    travel_style: str = "Standard"
