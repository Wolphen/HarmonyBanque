from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from sqlmodel import Session, create_engine, Field, SQLModel, select
import jwt
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from datetime import datetime
import random

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

class Account(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    balance: float
    creation_date: datetime = Field(default_factory=datetime.utcnow)
    account_number: str
    isMain: bool = False

class CreateAccount(BaseModel):
    user_id: int
    balance: float
    account_number: str
    isMain: bool = False

class CreateMainAccount(BaseModel):
    user_id: int
    balance: float
    account_number: str
    isMain: bool = True

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sender_id: int = Field(foreign_key="account.id")
    receiver_id: int = Field(foreign_key="account.id")
    amount: float
    transaction_date: datetime = Field(default_factory=datetime.utcnow)
    status: int 

class CreateTransaction(BaseModel):
    sender_id: int
    receiver_id: int
    amount: float
    status: int

class Deposit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    account_id: int = Field(foreign_key="account.id")
    amount: float
    deposit_date: datetime = Field(default_factory=datetime.utcnow)

class CreateDeposit(BaseModel):
    account_id: int
    amount: float

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
        test_users = [
            CreateUser(name="testuser1", password="password1"),
            CreateUser(name="testuser2", password="password2"),
            CreateUser(name="testuser3", password="password3"),
        ]
        for user_create in test_users:
            create_user(user_create, session)
        # Optionally, add test accounts
        test_accounts = [
            CreateAccount(user_id=1, balance=1000.0, account_number="ACC123456"),
            CreateAccount(user_id=2, balance=2000.0, account_number="ACC234567"),
            CreateAccount(user_id=3, balance=3000.0, account_number="ACC345678"),
        ]
        for account_create in test_accounts:
            create_account(account_create, session)
            
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

@app.post("/accounts/", response_model=Account)
def create_account(body: CreateAccount, session: Session = Depends(get_session)) -> Account:
    account = Account(
        user_id=body.user_id,
        balance=body.balance,
        account_number=body.account_number
    )
    session.add(account)
    session.commit()
    session.refresh(account)
    return account

@app.get("/accounts/", response_model=List[Account])
def read_accounts(session: Session = Depends(get_session)):
    accounts = session.exec(select(Account)).all()
    return accounts

@app.get("/accounts/{account_id}", response_model=Optional[Account])
def read_account(account_id: int, session: Session = Depends(get_session)):
    account = session.get(Account, account_id)
    return account

@app.post("/deposit/", response_model=Deposit)
def create_deposit(body: CreateDeposit, session: Session = Depends(get_session)) -> Deposit:
    deposit = Deposit(account_id=body.account_id, amount=body.amount)
    session.add(deposit)
    session.commit()
    session.refresh(deposit)
    return deposit

@app.get("/deposit/", response_model=List[Deposit])
def read_deposit(session: Session = Depends(get_session)):
    deposits = session.exec(select(Deposit)).all()
    return deposits

@app.post("/register", response_model=Account)
def register(user: CreateUser, session: Session = Depends(get_session)) -> Account:
    hashed_password = pwd_context.hash(user.password)
    db_user = User(name=user.name, hashed_password=hashed_password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
   
    account = Account(
        user_id=db_user.id,
        balance=0.0,  
        account_number=f"ACC{random.randint(000000, 999999)}"  
    )
    session.add(account)
    session.commit()
    session.refresh(account)
    
    return account

@app.get("/register", response_model=List[User])
def read_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users