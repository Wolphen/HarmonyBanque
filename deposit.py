from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from models import User, Account, Deposit, Transaction
from schemas import CreateUser, CreateAccount, CreateDeposit
from database import get_session
from typing import List, Optional
from auth import get_user

router = APIRouter()

@router.post("/", response_model=Deposit, tags=['deposit'])
def create_deposit(body: CreateDeposit, user: User = Depends(get_user), session: Session = Depends(get_session)) -> Deposit:
    # Find the main account by user ID and isMain=True
    account = session.exec(select(Account).where(Account.user_id == user.id, Account.account_number == body.account_number, Account.isActive == True)).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    # Update the account balance
    account.balance += body.amount
    session.add(account)
    
    # Create the deposit 
    deposit = Deposit(account_number=account.account_number, amount=body.amount)
    session.add(deposit)
    session.commit()
    session.refresh(deposit)
    return deposit

@router.get("/", response_model=List[Deposit], tags=['deposit'])
def read_deposit(user: User = Depends(get_user), session: Session = Depends(get_session)):
    # Find all accounts by user ID
    accounts = session.exec(select(Account).where(Account.user_id == user.id, Account.isActive == True)).all()
    account_numbers = [account.account_number for account in accounts]
    
    # Find all deposits for these accounts
    deposits = session.exec(select(Deposit).where(Deposit.account_number.in_(account_numbers))).all()
    return deposits