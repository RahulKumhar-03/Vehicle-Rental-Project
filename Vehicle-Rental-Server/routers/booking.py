from fastapi import APIRouter, HTTPException, Depends
from models.bookings import Booking, BookingCreate
from bson import ObjectId
from routers.auth import get_current_user, User
from typing import List
from config.database import booking_collection, vehicle_collection, user_collection
from plyer import notification

router = APIRouter()

@router.get("/", response_model=List[Booking]) 
async def get_all_bookings(currentUser: User = Depends(get_current_user)) -> List[Booking]:
    if currentUser.role == "admin":
        bookings = await booking_collection.find().to_list(None)
        result = []
        for booking in bookings:
            vehicle = await vehicle_collection.find_one({"_id": ObjectId(booking["vehicle_id"])})
            user = await user_collection.find_one({"_id": ObjectId(booking["user_id"])})
            user_name = booking.get("user_name") or (user.get("name") if user else None)
            booking_dict = {
                **booking,
                "id": str(booking["_id"]),
                "user_id": str(booking["user_id"]),
                "user_name": user_name,
                "vehicle_id": str(booking["vehicle_id"]),
                "vehicle_name": vehicle["model"] if vehicle else "Unknown" 
            }
            result.append(Booking(**booking_dict))
        return result
    else:
        bookings = await booking_collection.find({"user_id": str(currentUser.id)}).to_list(None)
        result = []
        for booking in bookings:
            vehicle = await vehicle_collection.find_one({"_id": ObjectId(booking["vehicle_id"])})
            booking_dict = {
                **booking,
                "id": str(booking["_id"]),
                "vehicle_id": str(booking["vehicle_id"]),
                "vehicle_name": vehicle["model"] if vehicle else "Unknown"
            }
            result.append(Booking(**booking_dict))
        return result
    
@router.post("/", response_model=Booking)
async def new_booking(booking: BookingCreate, currentUser: str = Depends(get_current_user)):
    if currentUser.role != "customer":
        raise HTTPException(status_code=403, detail="Only customers's can rent vehicles")
    
    vehicle = await vehicle_collection.find_one({"_id": ObjectId(booking.vehicle_id)})
    if not vehicle or vehicle["status"] != "available":
        notification.notify(
            title='Booking Alert',
            message=f"{booking.vehicle_name} not available for selected dates {booking.start_date}",
            app_name="main",
            timeout=5
        )
        raise HTTPException(status_code = 400, detail="Vehicle not available for booking")

    conflict = await booking_collection.count_documents({
        "vehicle_id": ObjectId(booking.vehicle_id),
        "$or" :[{"start_date": {"$lte": booking.end_date}, "end_date":{"$gte": booking.start_date}}]
    })

    if conflict > 0:
        raise HTTPException(status_code = 400, detail= "Vehicle is already booked for the selected dates")
    
    booking_dict = booking.dict()
    booking_dict["user_id"] = str(currentUser.id)
    booking_dict["total_amount"] = vehicle["rental_rate"] * ((booking.end_date - booking.start_date).days + 1)
    booking_dict["status"] = "confirmed"

    if booking.user_name:
        booking_dict["user_name"] = booking.user_name

    result = await booking_collection.insert_one(booking_dict)
    booking_dict["id"] = str(result.inserted_id)

    return Booking(**booking_dict)

@router.put("/{booking_id}", response_model=Booking)
async def updateBooking(booking_id: str, booking: BookingCreate, currentUser: User = Depends(get_current_user)):
    if currentUser.role != "customer":
       raise HTTPException(status_code=403, detail="Only customers's can update bookings!")
    
    existing_booking = await booking_collection.find_one({"_id": ObjectId(booking_id)})
    if not existing_booking:
        raise HTTPException(status_code=404, detail="No Booking Record Found!")
    if existing_booking["user_id"] != str(currentUser.id):
        raise HTTPException(status_code=403, detail="You can only update your booking record!!!")
    
    vehicle = await vehicle_collection.find_one({"_id": ObjectId(booking.vehicle_id)})
    if not vehicle or vehicle["status"] != "available":
        raise HTTPException(status_code=400, detail="Vehicle not available")
    
    conflicting = await booking_collection.count_documents({
        "vehicle_id": ObjectId(booking.vehicle_id),
        "_id": {"$ne": ObjectId(booking_id)},
        "$or": [
            {"start_date": {"$lte": booking.end_date}, "end_date":{"$gte":booking.start_date}}
        ]
    })
    if conflicting > 0:
        raise HTTPException(status_code=400,detail="Vehicle booked for selected dates")
    
    booking_dict = booking.dict()
    booking_dict["user_id"] = str(currentUser.id)
    booking_dict["status"] = "confirmed"
    booking_dict["total_amount"] = vehicle["rental_rate"] * ((booking.end_date - booking.start_date).days + 1)

    if booking.user_name:
        booking_dict["user_name"] = booking.user_name

    await booking_collection.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": booking_dict} 
    )

    if existing_booking["vehicle_id"] != booking.vehicle_id:
        pass

    updated_booking = await booking_collection.find_one({"_id": ObjectId(booking_id)})
    return {
        **updated_booking, 
        "id":str(updated_booking["_id"]), 
        "vehicle_id":str(updated_booking["vehicle_id"]), 
        "vehicle_name": vehicle["model"]
        }

@router.delete("/{booking_id}")
async def delete_booking(booking_id: str, currentUser: User = Depends(get_current_user)):
    if currentUser.role != "customer":
        raise HTTPException(status_code=403, detail="Only customers's can delete bookings!")
    
    booking = await booking_collection.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        raise HTTPException(status_code=404, detail="No Booking Record Found!!!")
    if booking["user_id"] != str(currentUser.id):
        raise HTTPException(status_code=403, detail="You can only delete your booking record!!!")
    
    result = await booking_collection.delete_one({"_id":ObjectId(booking_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No Booking Record Found!")

    await vehicle_collection.update_one(
        {"_id":ObjectId(booking["vehicle_id"])},
        {"$set": { "status":"available" }}
    )
    return {"message":"Booking Deleted Successfully"}


    