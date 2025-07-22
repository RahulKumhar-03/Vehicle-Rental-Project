from datetime import datetime
from config.database import vehicle_collection, booking_collection
from bson import ObjectId

async def update_vehicle_status():
    currentTime = datetime.utcnow()
    completed_bookings = await booking_collection.find({"end_date": {"$lt": currentTime}}).to_list(None)
    for booking in completed_bookings:
        vehicle = await vehicle_collection.find_one({"_id": ObjectId(booking["vehicle_id"])})
        if vehicle and vehicle["status"] == "rented":
            await vehicle_collection.update_one(
                {"_id": ObjectId(booking["vehicle_id"])},
                {"$set": {"status": "available"}}
            )

