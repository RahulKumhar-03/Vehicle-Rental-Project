from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings

client = AsyncIOMotorClient(settings.database_url)

db = client.vehicle_rental

user_collection = db.users
vehicle_collection = db.rental_vehicles
booking_collection = db.vehicle_bookings
maintenance_collection = db.vehicle_maintenance