from datetime import datetime,timedelta
from config.database import vehicle_collection, booking_collection
from bson import ObjectId

async def update_vehicle_status():
    current_time = datetime.utcnow()
    
    #current_time -= timedelta(hours=5, minutes=30)  
    
    vehicles = await vehicle_collection.find().to_list(None)
    
    for vehicle in vehicles:
        vehicle_id = str(vehicle["_id"])
     
        active_bookings = await booking_collection.find({
            "vehicle_id": vehicle_id,
            "start_date": {"$lte": current_time},
            "end_date": {"$gte": current_time},
            "status": "confirmed"
        }).to_list(None)
        
        new_vehicle_status = "available"
        
        if active_bookings:
            new_vehicle_status = "rented"
        elif vehicle.get("status") == "maintenance":
            new_vehicle_status = "maintenance"
       
        if vehicle["status"] != new_vehicle_status:
            await vehicle_collection.update_one(
                {"_id": ObjectId(vehicle_id)},
                {"$set": {"status": new_vehicle_status}}
            )
        
        completed_bookings = await booking_collection.find({
            "vehicle_id": vehicle_id,
            "end_date": {"$lt": current_time},
            "status": "confirmed"
        }).to_list(None)
        
        for booking in completed_bookings:
            await booking_collection.update_one(
                {"_id": ObjectId(booking["_id"])},
                {"$set": {"status": "completed"}}
            )


