from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Book title")
    author: str = Field(..., min_length=1, max_length=255, description="Author name")
    isbn: str = Field(..., min_length=5, max_length=20, description="International Standard Book Number")
    genre: str = Field(..., min_length=1, max_length=100, description="Genre/Category")
    price: float = Field(..., ge=0.0, description="Price in USD")
    stock: int = Field(default=0, ge=0, description="Available stock quantity")
    description: Optional[str] = Field(default=None, description="Detailed book summary")


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    author: Optional[str] = Field(None, min_length=1, max_length=255)
    isbn: Optional[str] = Field(None, min_length=5, max_length=20)
    genre: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[float] = Field(None, ge=0.0)
    stock: Optional[int] = Field(None, ge=0)
    description: Optional[str] = None


class BookResponse(BookBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
