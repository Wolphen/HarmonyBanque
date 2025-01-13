from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
import jwt
from models import User
from schemas import CreateUser
from database import get_session
from sqlmodel import select, Session

router = APIRouter()

secret_key = "very_secret_key"
algorithm = "HS256"
bearer_scheme = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_token(user: User):
    return jwt.encode({"id": user.id, "name": user.name}, secret_key, algorithm=algorithm)

@router.post("/login")
def login(user: CreateUser, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.name == user.name)).first()
    if db_user is None or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    return {"token": generate_token(db_user)}

@router.post("/register", response_model=User)
def register(user: CreateUser, session: Session = Depends(get_session)):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(name=user.name, hashed_password=hashed_password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def get_user(authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        payload = jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])
        user_id: int = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        with Session(engine) as session:
            user = session.get(User, user_id)
            if user is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
            return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")