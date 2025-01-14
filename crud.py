import random
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models import User, Account, Deposit
from schemas import CreateUser, CreateAccount, CreateDeposit
from database import get_session
from typing import List, Optional
from auth import get_user

router = APIRouter()

@router.post("/users/", response_model=User)
def create_user(body: CreateUser, session: Session = Depends(get_session)) -> User:
    hashed_password = pwd_context.hash(body.password)
    user = User(email=body.email, hashed_password=hashed_password)
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

def generate_unique_account_number(session: Session) -> str:
    while True:
        account_number = f"ACC{random.randint(100000, 999999)}"
        existing_account = session.exec(select(Account).where(Account.account_number == account_number)).first()
        if existing_account is None:
            return account_number

@router.post("/accounts/", response_model=Account)
def create_account(body: CreateAccount, user: User = Depends(get_user), session: Session = Depends(get_session)) -> Account:
    account_number = generate_unique_account_number(session)

    account = Account(
        user_id=user.id,  
        balance=body.balance,
        account_number=account_number  # Unique account number
    )
    session.add(account)
    session.commit()
    session.refresh(account)
    return account

@router.get("/accounts/", response_model=List[Account])
def read_accounts(user: User = Depends(get_user), session: Session = Depends(get_session)):
    accounts = session.exec(select(Account).where(Account.user_id == user.id)).all()
    return accounts


@router.get("/accounts/{account_number}", response_model=Optional[Account])
def read_account(account_number: str, user: User = Depends(get_user), session: Session = Depends(get_session)):
    account = session.exec(select(Account).where(Account.account_number == account_number)).first()
    if account is None or account.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found or you do not have permission to access this account")
    return account

@router.post("/deposit/", response_model=Deposit)
def create_deposit(body: CreateDeposit, user: User = Depends(get_user), session: Session = Depends(get_session)) -> Deposit:
    # Find the main account by user ID and isMain=True
    account = session.exec(select(Account).where(Account.user_id == user.id, Account.isMain == True)).first()
    if not account:
        raise HTTPException(status_code=404, detail="Main account not found")
    
    # Update the account balance
    account.balance += body.amount
    session.add(account)
    
    # Create the deposit 
    deposit = Deposit(account_number=account.account_number, amount=body.amount)
    session.add(deposit)
    session.commit()
    session.refresh(deposit)
    return deposit

@router.get("/deposit/", response_model=List[Deposit])
def read_deposit(user: User = Depends(get_user), session: Session = Depends(get_session)):
    # Find all accounts by user ID
    accounts = session.exec(select(Account).where(Account.user_id == user.id)).all()
    account_numbers = [account.account_number for account in accounts]
    
    # Find all deposits for these accounts
    deposits = session.exec(select(Deposit).where(Deposit.account_number.in_(account_numbers))).all()
    return deposits