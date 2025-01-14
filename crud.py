from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models import User, Account, Deposit
from schemas import CreateUser, CreateAccount, CreateDeposit
from database import get_session
from typing import List, Optional
from passlib.context import CryptContext
from auth import get_user

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()

@router.post("/users/", response_model=User)
def create_user(body: CreateUser, session: Session = Depends(get_session)) -> User:
    hashed_password = pwd_context.hash(body.password)
    user = User(name=body.name, hashed_password=hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.get("/users/", response_model=List[User])
def read_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users

@router.get("/users/{user_id}", response_model=Optional[User])
def read_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    return user

@router.get("/me", response_model=User)
def read_me(user: User = Depends(get_user)):
    return user

@router.post("/accounts/", response_model=Account)
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

@router.get("/accounts/", response_model=List[Account])
def read_accounts(session: Session = Depends(get_session)):
    accounts = session.exec(select(Account)).all()
    return accounts

@router.get("/accounts/{account_id}", response_model=Optional[Account])
def read_account(account_id: int, session: Session = Depends(get_session)):
    account = session.get(Account, account_id)
    return account

@router.post("/deposit/", response_model=Deposit)
def create_deposit(body: CreateDeposit, user: User = Depends(get_user), session: Session = Depends(get_session)) -> Deposit:
    # Find the account by user ID
    account = session.exec(select(Account).where(Account.user_id == user.id)).first()
    if not account:
        raise HTTPException(status_code=404, detail="Not connected to any account")
    
    # Update the account balance
    account.balance += body.amount
    session.add(account)
    
    # Create the deposit record
    deposit = Deposit(account_number=account.account_number, amount=body.amount)
    session.add(deposit)
    session.commit()
    session.refresh(deposit)
    return deposit

@router.get("/deposit/", response_model=List[Deposit])
def read_deposit(session: Session = Depends(get_session)):
    deposits = session.exec(select(Deposit)).all()
    return deposits