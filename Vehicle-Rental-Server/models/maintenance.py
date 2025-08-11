from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MaintenanceBase(BaseModel):
    vehicle_id: str
    vehicle_name: str
    maintenance_date: str

class MaintenanceCreate(MaintenanceBase):
    pass

class Maintenance(MaintenanceBase):
    id: Optional[str] = None

    class config:
        json_encoders = {datetime: lambda v: v.isoformat()}