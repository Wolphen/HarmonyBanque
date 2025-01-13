from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    hashed_password: str

class Account(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    balance: float
    creation_date: datetime = Field(default_factory=datetime.utcnow)
    account_number: str
    isMain: bool = False

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sender_id: int = Field(foreign_key="account.id")
    receiver_id: int = Field(foreign_key="account.id")
    amount: float
    transaction_date: datetime = Field(default_factory=datetime.utcnow)
    status: int 

class Deposit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    account_id: int = Field(foreign_key="account.id")
    amount: float
    deposit_date: datetime = Field(default_factory=datetime.utcnow)