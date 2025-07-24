from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings

client = AsyncIOMotorClient(settings.database_url)

db = client.vehicle_rental

user_collection = db.users
# blacklist_tokens_collection = db.blacklisted_tokens
vehicle_collection = db.vehicles
booking_collection = db.bookings
maintenance_collection = db.vehicle_maintenance