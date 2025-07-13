from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "customer" 
    address: str
    
    @validator("role")
    def validate_role(cls, v):
        if v not in ["customer", "admin"]:
            raise ValueError(f"Role must be one of 'customer' or 'admin'")
        return v
    

class UserCreate(UserBase): #used while creating a new user
    password: str      

class User(UserBase):
    id: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        json_encoders = { datetime: lambda v:v.isoformat() }
