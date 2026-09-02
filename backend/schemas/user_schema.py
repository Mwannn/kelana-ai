from pydantic import BaseModel

from typing import Optional

class UserBase(BaseModel):
    name: str
    email: str
    gender: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    avatar_url: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True
