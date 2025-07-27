from config.database import maintenance_collection, vehicle_collection
from models.maintenance import Maintenance
from models.vehicle import Vehicle
from bson import ObjectId
from typing import List
from datetime import datetime, timedelta
from plyer import notification

async def maintenance_check_alerts():
  
    threshold_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    upcoming_maintenances = await maintenance_collection.find({
        "maintenance_date": {
            "$gte": threshold_date + timedelta(days=2), 
            "$lt": threshold_date + timedelta(days=3) 
        },
        "status": "scheduled"
    }).to_list(None)

    for maintenance in upcoming_maintenances:
        maintenance_threshold = maintenance["maintenance_date"] - timedelta(days=2)
        if maintenance_threshold.date() == datetime.utcnow().date():
            
            vehicle = await vehicle_collection.find_one({"_id": ObjectId(maintenance["vehicle_id"])})
            if vehicle and vehicle["status"] != "rented":
                await vehicle_collection.update_one(
                    {"_id": ObjectId(maintenance["vehicle_id"])},
                    {"$set": {"status": "maintenance"}}
                )
            elif vehicle and vehicle["status"] == "rented":
                notification.notify(
                    title='Maintenance Alert',
                    message=f"{vehicle['model']} currently rented for date {maintenance['maintenance_date']}",
                    app_name="main",
                    timeout=5
                )

    completed_maintenances = await maintenance_collection.find({
        "maintenance_date": {"$lt": datetime.utcnow()},
        "status": {"$ne": "completed"}
    }).to_list(None)

    for maintenance in completed_maintenances:
        vehicle = await vehicle_collection.find_one({"_id": ObjectId(maintenance["vehicle_id"])})

        if vehicle and vehicle["status"] == "maintenance":

            update_data = {"status": "available", "last_maintenance": maintenance["maintenance_date"]}

            await vehicle_collection.update_one(
                {"_id": ObjectId(maintenance["vehicle_id"])},
                {"$set": update_data}
            )

            await maintenance_collection.update_one(
                {"_id": ObjectId(maintenance["_id"])},
                {"$set": {"status": "Completed"}}
            )    

