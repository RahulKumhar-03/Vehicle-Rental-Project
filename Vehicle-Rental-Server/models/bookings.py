from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List

class BookingBase(BaseModel):
    vehicle_id: str
    vehicle_name: str 
    user_id: str
    start_date: datetime
    end_date: datetime

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: Optional[str] = None
    status: str = "pending"
    total_amount: Optional[float] = None

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}