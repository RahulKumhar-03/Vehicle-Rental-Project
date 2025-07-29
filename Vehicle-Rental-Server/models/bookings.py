from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class BookingBase(BaseModel):
    vehicle_id: str
    vehicle_name: str 
    user_id: str
    user_name: Optional[str] = None
    start_date: str 
    end_date: str 

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: Optional[str] = None
    status: str = "Pending"
    total_amount: Optional[float] = None

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}