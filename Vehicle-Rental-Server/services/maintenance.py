from config.database import maintenance_collection, vehicle_collection
from models.maintenance import Maintenance
from models.vehicle import Vehicle
from bson import ObjectId
from typing import List
from datetime import datetime, timedelta
from plyer import notification

async def maintenance_check_alerts() -> List[Maintenance]:
    threshold_date = datetime.utcnow() + timedelta(days=2)

    maintenance_records = []

    upcoming_maintenances = await maintenance_collection.find({
        "maintenance_date": {"$lte": threshold_date},
        "status": "scheduled"
    }).to_list(None)
    for maintenance in upcoming_maintenances:
        vehicle = vehicle_collection.find_one({
            "_id": ObjectId(maintenance["vehicle_id"])
        })
        if vehicle and vehicle["status"] != "rented":
            await vehicle_collection.update_one(
                {"_id": ObjectId(maintenance["vehicle_id"])},
                {"$set": {"status": "maintenance"}}
            )
        elif vehicle["status"] == 'rented':
            notification.notify(
                title='Maintenance Alert',
                message=f"{vehicle["model"]} currently rented for date {maintenance.start_date}",
                app_name="main",
                timeout=5
            )

    completed_maintenances = await maintenance_collection.find({"maintenance_date": {"$lt": datetime.utcnow()}}).to_list(None)
    for maintenance in completed_maintenances:
        vehicle = await vehicle_collection.find_one({"_id": ObjectId(maintenance["vehicle_id"])})

        if vehicle and vehicle["status"] == "maintenance":

            update_data = {"status": "available"}
            if vehicle.get("next_maintenance") and vehicle["next_maintenance"] < datetime.utcnow():
                last_maintenance = maintenance["maintenance_date"]
                update_data["last_maintenance"] = last_maintenance
                update_data["next_maintenance"] = None

            await vehicle_collection.update_one(
                {"_id": ObjectId(maintenance["vehicle_id"])},
                {"$set": update_data}
            )

            await maintenance_collection.update_one(
                {"_id": ObjectId(maintenance["_id"])},
                {"$set": {"status": "Completed"}}
            )    
    return maintenance_records

