from config.database import maintenance_collection, vehicle_collection
from models.maintenance import Maintenance
from models.vehicle import Vehicle
from bson import ObjectId
from typing import List
from datetime import datetime, timedelta

async def maintenance_check_alerts() -> List[Vehicle]:
    threshold_date = datetime.utcnow() + timedelta(days=4)
    vehicles_due_for_maintenance = await vehicle_collection.find({"next_maintenance": {"$lte": threshold_date}}).to_list(None)
    for vehicle in vehicles_due_for_maintenance:
        maintenance = ({
            "vehicle_id": str(vehicle["_id"]),
            "maintenance_date": vehicle['next_maintenance'],
            "description": f"Scheduled maintenance for {vehicle['model']}",
            "status": "scheduled"
        })
        result = await maintenance_collection.insert_one(maintenance)
        maintenance["id"] = str(result.inserted_id)

        await vehicle_collection.update_one(
            {"_id": vehicle["_id"]},
            {"$set": {"status": "maintenance"}}
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

    return [Vehicle(**{**v, "id": str(v["_id"])}) for v in vehicles_due_for_maintenance]

