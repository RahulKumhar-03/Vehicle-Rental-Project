from datetime import datetime, timedelta
from config.database import vehicle_collection, booking_collection
from bson import ObjectId
from typing import List, Optional
from models.vehicle import Vehicle

async def check_availability(start_date: Optional[datetime] = None, end_date: Optional[datetime] = None, vehicle_type: Optional[str] = None) -> List[Vehicle]:
    query = {}
    if vehicle_type:
        query["type"] = vehicle_type
    
    vehicles = await vehicle_collection.find(query).to_list(None)
    available_vehicles = []

    current_date = datetime.utcnow()
    for vehicle in vehicles:
        if start_date and end_date:
            if end_date <= start_date:
                continue
            conflicting_bookings = await booking_collection.find({
                "vehicle_id": str(vehicle["_id"]),
                "$or":[
                    {"start_date": {"$lte": end_date}, "end_date":{"$gte": start_date}},
                ]
            }).to_list(None)
            if len(conflicting_bookings) == 0:
                vehicle["id"] = str(vehicle["_id"])
                available_vehicles.append(Vehicle(**vehicle))
        else:
            conflicting_bookings = await booking_collection.find({
                "vehicle_id": str(vehicle["_id"]),
                "start_date": {"$lte": current_date},
                "end_date": {"$gte": current_date}
            }).to_list(None)
            if len(conflicting_bookings) == 0:
                vehicle["id"] = str(vehicle["_id"])
                available_vehicles.append(Vehicle(**vehicle))
    return available_vehicles
