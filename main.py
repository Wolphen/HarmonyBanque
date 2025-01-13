from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from sqlmodel import Session, create_engine, Field, SQLModel, select
import jwt
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext

app = FastAPI()

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

secret_key = "very_secret_key"
algorithm = "HS256"

bearer_scheme = HTTPBearer()

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    hashed_password: str

class CreateUser(BaseModel):
    name: str
    password: str

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

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

def generate_token(user: User):
    return jwt.encode({"id": user.id, "name": user.name}, secret_key, algorithm=algorithm)

@app.post("/login")
def login(user: CreateUser, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.name == user.name)).first()
    if db_user is None or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    return {"token": generate_token(db_user)}

@app.get("/me")
def me(user=Depends(get_user)):
    return user

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        # Add test users
        test_users = [
            CreateUser(name="testuser1", password="password1"),
            CreateUser(name="testuser2", password="password2"),
            CreateUser(name="testuser3", password="password3"),
        ]
        for user_create in test_users:
            create_user(user_create, session)

@app.post("/users/", response_model=User)
def create_user(body: CreateUser, session: Session = Depends(get_session)) -> User:
    hashed_password = pwd_context.hash(body.password)
    user = User(name=body.name, hashed_password=hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.get("/users/", response_model=List[User])
def read_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users

@app.get("/users/{user_id}", response_model=Optional[User])
def read_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    return user