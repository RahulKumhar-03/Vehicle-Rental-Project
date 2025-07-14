from config.database import maintenance_collection, vehicle_collection
from models.maintenance import Maintenance
from models.vehicle import Vehicle
from bson import ObjectId
from typing import List
from datetime import datetime, timedelta

async def maintenance_check_alerts() -> List[Vehicle]:
    threshold_date = datetime.utcnow() - timedelta(days=5)
    vehicles_due_for_maintenance = await vehicle_collection.find({"next_maintenance": {"$lte": threshold_date}}).to_list(None)
    for vehicle in vehicles_due_for_maintenance:
        maintenance = ({
            "vehicle_id": str(vehicle["_id"]),
            "maintenance_date": threshold_date,
            "description": "Scheduled maintenance for {vehicle['model']}",
            "status": "scheduled"
        })
        result = await maintenance_collection.insert_one(maintenance)
        maintenance["id"] = str(result.inserted_id)

        await vehicle_collection.update_one(
            {"_id": vehicle["_id"]},
            {"$set": {"status": "maintenance"}}
        )
    return [Vehicle(**{**v, "id": str(v["_id"])}) for v in vehicles_due_for_maintenance]

