from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    address: str
    
class UserCreate(UserBase): 
    password: str      

class User(UserBase):
    id: Optional[str] = None
    created_at: Optional[datetime] = None
    role: str = "customer"
    
    @validator("role")
    def validate_role(cls, v):
        if v not in ["customer", "admin"]:
            raise ValueError(f"Role must be one of 'customer' or 'admin'")
        return v

    class Config:
        json_encoders = { datetime: lambda v:v.isoformat() }
