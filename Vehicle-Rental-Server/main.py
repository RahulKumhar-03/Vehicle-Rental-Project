from fastapi import FastAPI, Depends
from routers import auth, vehicle, booking, maintenance
from routers.auth import security
from services.maintenance import maintenance_check_alerts
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from config.database import user_collection, booking_collection, maintenance_collection, vehicle_collection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "UPDATE", "OPTIONS"], 
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(auth.router, prefix="/auth",tags=["auth"])
app.include_router(vehicle.router, prefix="/vehicle", tags=["vehicle"], dependencies=[Depends(security)])
app.include_router(booking.router, prefix="/booking", tags=["booking"], dependencies=[Depends(security)])  
app.include_router(maintenance.router, prefix="/maintenance", tags=["maintenance"], dependencies=[Depends(security)])

async def init_db_indexes():
    await user_collection.create_index([("email", 1), ("role",1)])
    await vehicle_collection.create_index([("status",1), ("type",1)])
    await maintenance_collection.create_index([("vehicle_id",1), ("maintenance_date",1)])
    await booking_collection.create_index([("user_id",1), ("vehicle_id",1), ("start_date",1), ("end_date",1)])

scheduler = AsyncIOScheduler()
scheduler.add_job(maintenance_check_alerts, 'interval', days=1)
scheduler.start()

@app.on_event("startup")
async def start_up_event():
    await init_db_indexes()
    print("Starting the fastapi application")

@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()
    print("Shutting down the fastapi application")