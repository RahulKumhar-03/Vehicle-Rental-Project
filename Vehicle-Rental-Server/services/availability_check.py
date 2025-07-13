from datetime import datetime, timedelta
from config.database import vehicle_collection, booking_collection
from bson import ObjectId
from typing import List
from models.vehicle import Vehicle

async def check_availability(start_date: datetime, end_date: datetime, vehicle_type: str = None) -> List[Vehicle]:
    query = {"status":"available"}
    if vehicle_type:
        query["type"] = vehicle_type
    
    vehicles = await vehicle_collection.find(query).to_list(None)
    available_vehicles = []
    for vehicle in vehicles:
        conflicting_bookings = await booking_collection.find({
            "vehicle_id": vehicle["_id"],
            "$or": [
                {"start_date": {"$lte": end_date}, "end_date": {"$gte": start_date}},
            ]
        })
        if conflicting_bookings == 0:
            vehicle["id"] = str(vehicle["_id"])
            available_vehicles.append(Vehicle(**vehicle))
    return available_vehicles