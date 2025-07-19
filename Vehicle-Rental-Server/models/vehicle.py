from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class VehicleBase(BaseModel):
    model: str
    type: str
    license_plate_no: str
    rental_rate: float
    location: str
    description: Optional[str] = None
<<<<<<< HEAD
    imageUrl: Optional[str] = None
    range: Optional[float] = None
    gearType: Optional[str] = None

    @validator("gearType")
    def validate_gear_type(cls, v):
        if v and v not in ["automatic", "manual"]:
            raise ValueError("gearType must be 'automatic' or 'manual'")
        return v
=======
>>>>>>> 42042e656aa8ede617cf0e991dd29787822006d6

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: Optional[str] = None
    status: str = "available"
    last_maintenance: Optional[datetime] = None
    next_maintenance: Optional[datetime] = None

    class Config:
        json_encoders = { datetime: lambda v: v.isoformat() }