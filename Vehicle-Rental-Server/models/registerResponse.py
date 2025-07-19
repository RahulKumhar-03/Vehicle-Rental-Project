from pydantic import BaseModel
from models.user import User
class RegisterResponse(BaseModel):
    user: User
    access_token: str
    token_type: str