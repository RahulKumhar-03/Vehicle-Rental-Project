from fastapi import FastAPI
from routers import auth, vehicle, booking 

app = FastAPI()

app.include_router(auth.router, prefix="/auth",tags=["auth"])
