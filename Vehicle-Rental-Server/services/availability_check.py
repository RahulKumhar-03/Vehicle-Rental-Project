from datetime import datetime
from config.database import vehicle_collection, booking_collection, maintenance_collection
from typing import List, Optional
from models.vehicle import Vehicle
from services.parse_date import parse_date
from fastapi import HTTPException
from plyer import notification

async def check_availability(start_date: Optional[str] = None, end_date: Optional[str] = None, vehicle_type: Optional[str] = None) -> List[Vehicle]:
    
    try:
        startDate = parse_date(start_date)
        endDate = parse_date(end_date)
    except HTTPException as e:
        e

    start_date_str = startDate.replace(hour=0, minute=0, second=0, microsecond=0).strftime("%Y-%m-%dT00:00:00.000+00:00")
    end_date_str = endDate.replace(hour=0,minute=0,second=0,microsecond=0).strftime("%Y-%m-%dT00:00:00.000+00:00")

    if vehicle_type:
        vehicles = await vehicle_collection.find({
            "type": vehicle_type
        }).to_list(None)
    else: 
        vehicles = await vehicle_collection.find({}).to_list(None)

    available_vehicles = []

    for vehicle in vehicles:
        conflicting_bookings = await booking_collection.find_one({
            "vehicle_id": str(vehicle["_id"]),
            "$and": [
                {"start_date": {"$lte": end_date_str}}, 
                {"end_date":{"$gte": start_date_str}}
            ]
        })
        conflicting_maintenance = await maintenance_collection.find_one({
            "vehicle_id": str(vehicle["_id"]),
            "$and":[
                {"maintenance_date":{"$gte":start_date_str}},
                {"maintenance_date":{"$lte":end_date_str}},
            ]
        })
        if not conflicting_bookings and not conflicting_maintenance:
            vehicle["id"] = str(vehicle["_id"])
            available_vehicles.append(Vehicle(**vehicle))
        if not available_vehicles:
            notification.notify(
                title="No Vehicles Available",
                message="No vehicles available for the selected dates and type.",
                app_name="Vehicle Rental System"
            )
            raise HTTPException(status_code=404, detail="No vehicles available for the selected dates and type.")
    return available_vehicles
