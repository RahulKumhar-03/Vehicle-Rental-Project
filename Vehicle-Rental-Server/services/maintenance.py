from config.database import maintenance_collection
from bson import ObjectId
from datetime import datetime

async def maintenance_check_alerts():

    completed_maintenances = await maintenance_collection.find({
        "maintenance_date": {"$lt": datetime.utcnow()},
        "status": {"$ne": "completed"}
    }).to_list(None)

    for maintenance in completed_maintenances:
        await maintenance_collection.update_one(
            {"_id": ObjectId(maintenance["_id"])},
            {"$set": {"status": "Completed"}}
        )    

