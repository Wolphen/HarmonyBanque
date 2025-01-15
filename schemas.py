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
    sender_id: str
    receiver_id: str
    amount: float

class CreateDeposit(BaseModel):
    account_number: str
    amount: float

class UserResponse(BaseModel):
    email: str