from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CreateUser(BaseModel):
    email: str
    password: str
    username: str  

class LoginUser(BaseModel):
    email: str
    password: str

class CreateAccount(BaseModel):
    balance: float
    account_number: str
    isMain: bool = False
    name: str  

class CreateTransaction(BaseModel):
    sender_id: str
    receiver_id: str
    amount: float
    description: Optional[str] = None  

class CreateDeposit(BaseModel):
    amount: float

class UserResponse(BaseModel):
    email: str
    username: str  

class IncomeResponse(BaseModel):
    account_number: str
    amount: float
    date: datetime
    type: str

    class Config:
        from_attributes = True  