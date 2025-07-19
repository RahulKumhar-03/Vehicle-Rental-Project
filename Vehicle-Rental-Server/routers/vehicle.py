from fastapi import APIRouter, Depends, HTTPException, Query
from models.vehicle import Vehicle, VehicleCreate
from config.database import vehicle_collection
from bson import ObjectId
from routers.auth import get_current_user, User
from typing import List
from datetime import datetime
from services.availability_check import check_availability

router = APIRouter()

@router.get("/", response_model=List[Vehicle]) #Read all the vehicles in the database
async def getVehicles():
    vehicles = await vehicle_collection.find().to_list(None)
    return [Vehicle(**{**v, "id": str(v["_id"])}) for v in vehicles]

@router.post("/", response_model=Vehicle)
async def create_vehicle(vehicle: VehicleCreate, currentUser: User = Depends(get_current_user)):

    if currentUser.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Management Privileges allowed for admin only")

    vehicle_data = vehicle.dict()
    vehicle_data["last_maintenance"] = None
    vehicle_data["next_maintenance"] = None
    vehicle_data["status"] = "available"

    result = await vehicle_collection.insert_one(vehicle_data)
    vehicle_data["id"] = str(result.inserted_id)

    return Vehicle(**vehicle_data)
 

@router.put("/{vehicle_id}", response_model=Vehicle)
async def updateVehicle(vehicle_id: str, vehicle: VehicleCreate, currentUser: User = Depends(get_current_user)):
    if currentUser.role != "admin":
        raise HTTPException(status_code=403, detail="Management Privileges allowed for Admin only")
    result = await vehicle_collection.update_one(
        {"_id": ObjectId(vehicle_id)}, 
        {"$set": vehicle.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle_dict = await vehicle_collection.find_one({"_id": ObjectId(vehicle_id)})
    vehicle_dict["id"] = str(vehicle_dict["_id"])
    return Vehicle(**vehicle_dict)

@router.delete("/{vehicle_id}")
async def deleteVehicle(vehicle_id: str, currentUser: User = Depends(get_current_user)):
    if currentUser.role != "admin":
        raise HTTPException(status=403, detail="Management Privileges allowed for Admin only")
    result = await vehicle_collection.delete_one({"_id": ObjectId(vehicle_id)})
    if result.deleted_count == 0:
        raise HTTPException(statue_code=404, detail="Vehicle doesn't exists")
    return {"message": "Vehicle deleted"}

@router.get('/available', response_model=List[Vehicle])
async def get_available_vehicle(start_date: datetime = Query(...), end_date: datetime = Query(...), vehicle_type: str = Query(None)):
    return await check_availability(start_date, end_date, vehicle_type)

@router.get("/{vehicle_id}", response_model=Vehicle)
async def get_vehicle_details(vehicle_id: str):
    vehicle = await vehicle_collection.find_one({"_id": ObjectId(vehicle_id)})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle["id"] = str(vehicle["_id"])
    return Vehicle(**vehicle)