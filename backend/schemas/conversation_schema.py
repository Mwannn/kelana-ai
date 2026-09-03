from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    pass

class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationBase(BaseModel):
    title: Optional[str] = "Percakapan Baru"

class ConversationCreate(BaseModel):
    title: Optional[str] = "Percakapan Baru"

class ConversationUpdate(BaseModel):
    title: str

class ConversationResponse(BaseModel):
    id: int
    conversation_id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationDetailResponse(BaseModel):
    id: int
    conversation_id: int
    title: str
    created_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True
