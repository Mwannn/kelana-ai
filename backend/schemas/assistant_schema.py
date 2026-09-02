from pydantic import BaseModel
from typing import Optional, List, Any

class QuestionRequest(BaseModel):
    question: str

class QuestionResponse(BaseModel):
    question: str
    answer: str
    source: Optional[str] = None
    sources: Optional[List[str]] = []
    citations: Optional[List[Any]] = []
