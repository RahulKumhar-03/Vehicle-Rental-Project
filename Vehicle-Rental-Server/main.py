from fastapi import FastAPI, Depends
from routers import auth, vehicle, booking
from routers.auth import security

app = FastAPI()

app.include_router(auth.router, prefix="/auth",tags=["auth"])
app.include_router(vehicle.router, prefix="/vehicle", tags=["vehicle"], dependencies=[Depends(security)])  # Apply security to all vehicle endpoints)
