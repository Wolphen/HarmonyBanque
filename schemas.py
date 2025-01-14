from pydantic import BaseModel

class CreateUser(BaseModel):
    email: str
    password: str

class CreateAccount(BaseModel):
    user_id: int
    balance: float
    account_number: str
    isMain: bool = False

class CreateTransaction(BaseModel):
    sender_id: int
    receiver_id: int
    amount: float
    status: int

class CreateDeposit(BaseModel):
    amount: float