import jwt
import bcrypt
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from models.user import User, UserCreate
from datetime import datetime
from config.settings import settings
from config.database import user_collection
# from config.database import blacklist_tokens_collection
from bson import ObjectId
from datetime import datetime, timedelta
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from models.loginResponse import LoginResponse

router = APIRouter()

security = HTTPBearer()

oauth2 = OAuth2PasswordBearer(tokenUrl='auth/login')

def hashing_pwd(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode('utf-8')

def check_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(),hashed_password.encode())

def create_jwt_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=1)
    to_encode.update({"exp":expire})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.algorithm)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.algorithm])
        user_id = payload.get("sub")
        user = await user_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user_dict = {**user, "id": str(user["_id"])}
        return User(**user_dict)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    '''
    blacklisted = await blacklist_tokens_collection.find_one({"token":token})
    if blacklisted:
        raise HTTPException(status_code=401, detail="Token has been blacklisted")
    '''
    
    
@router.post("/register", response_model=User)
async def register_user(user: UserCreate):
    existing_user = await user_collection.find_one({"email":user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered! Please login.")
    hashed_password = hashing_pwd(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_dict["role"] = "customer"
    user_dict["created_at"] = datetime.utcnow()
    new_user = await user_collection.insert_one(user_dict)
    user_dict["id"] = str(new_user.inserted_id)
    return User(**user_dict)

@router.post("/register-admin", response_model=User)
async def register_admin(user: UserCreate):
    existing_admin = await user_collection.find_one({"role": "admin"})
    if existing_admin:
        raise HTTPException(status_code = 400, detail="Admin already exists! Please Login")
    
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered! Please login.")
    
    hashed_password = hashing_pwd(user.password)

    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_dict["role"] = "admin"
    user_dict["created_at"] = datetime.utcnow()

    result = await user_collection.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    return  User(**user_dict)

@router.post("/login", response_model=LoginResponse)
async def loginUser(email: str, password:str):
    user = await user_collection.find_one({"email": email})

    if not user or not check_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_jwt_token(data={"sub": str(user["_id"])})

    user_dict = {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role","user"),
        "address": user["address"]
    }
    return {"access_token": token, "token_type": "bearer", "user": user_dict}


'''
@router.post("/logout")
async def logoutUser(request: Request, token: str = Depends(oauth2)):
    # trying to get token from Authorization header
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.lower().startswith("bearer "):
        token = auth_header.split(" ", 1)[1]
    # If the token not found in the header, use token passed in the function's parameter
    if not token:
        return {"Message": "No token provided, but logout successful (stateless)."}
    existing = await blacklist_tokens_collection.find_one({"token": token})
    if not existing:
        await blacklist_tokens_collection.insert_one({
            "token": token,
            "blacklisted_at": datetime.utcnow()
        })
    return {"Message": "User Successfully Logged Out"}
'''