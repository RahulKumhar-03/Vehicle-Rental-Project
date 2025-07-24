from fastapi import APIRouter, HTTPException, Depends
from config.database import maintenance_collection, vehicle_collection
from services.maintenance import maintenance_check_alerts
from bson import ObjectId
from models.maintenance import Maintenance, MaintenanceCreate
from models.vehicle import Vehicle
from routers.auth import get_current_user, User
from typing import List

router = APIRouter()

@router.post("/", response_model=Maintenance)
async def create_maintenance(maintenance: MaintenanceCreate, currentUser: User = Depends(get_current_user)):
    if currentUser.role != "admin":
        raise HTTPException(status_code=403, detail="Management Privileges restricted to admins only")
    
    maintenance_dict = maintenance.dict()
    vehicle = await vehicle_collection.find_one({"_id": ObjectId(maintenance.vehicle_id)})
    if not vehicle: 
        raise HTTPException(status_code=400, detail="Vehicle Not Found")
    
    result = await maintenance_collection.insert_one(maintenance_dict)

    await vehicle_collection.update_one(
        {"_id": ObjectId(maintenance.vehicle_id)},
        {"$set": {"last_maintenance": vehicle["next_maintenance"]}} 
    )

    await vehicle_collection.update_one(
        {"_id": ObjectId(maintenance.vehicle_id)},
        {"$set": {"next_maintenance":maintenance.maintenance_date}}
    )

    maintenance_dict["id"] = str(result.inserted_id)
    return Maintenance(**maintenance_dict)

@router.get("/", response_model=List[Maintenance])
async def get_all_maintenance():
    maintenances = await maintenance_collection.find().to_list(None)
    return [Maintenance(**{**maintenance, "id": str(maintenance["_id"])}) for maintenance in maintenances]

@router.put("/{maintenance_id}", response_model=Maintenance)
async def update_maintenance(maintenance_id: str, maintenance:MaintenanceCreate, currentUser: User = Depends(get_current_user)):
    if currentUser.role != "admin":
        raise HTTPException(staus_code=403, detail="Management Privileges restricted to Admin's only")

    result = await maintenance_collection.update_one(
        {"_id": ObjectId(maintenance_id)},
        {"$set": maintenance.dict()}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="No Records found")
    
    await vehicle_collection.update_one(
        {"_id": ObjectId(maintenance.vehicle_id)},
        {"$set": {"next_maintenance" : maintenance.maintenance_date}}
    )

    maintenance_dict = await maintenance_collection.find_one({"_id": ObjectId(maintenance_id)})
    maintenance_dict["id"] = str(maintenance_dict["_id"])
    return Maintenance(**maintenance_dict)

@router.delete("/{maintenance_id}")
async def delete_maintenance(maintenance_id: str, currentUser: User = Depends(get_current_user)):
    if currentUser.role != "admin":
        raise HTTPException(status_code=403, detail="Management Privileges restricted to Admin's only")
    result = await maintenance_collection.delete_one({"_id": ObjectId(maintenance_id)})
    return {"message": "Maintenance record deleted successfully"} if result.deleted_count > 0 else {"message":"No Records Found"}


    
