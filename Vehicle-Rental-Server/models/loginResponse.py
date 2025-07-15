from pydantic import BaseModel
from models.user import User

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: User