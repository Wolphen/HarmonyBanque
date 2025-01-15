import random
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models import User, Account, Deposit, Transaction
from schemas import CreateUser, CreateAccount, CreateDeposit
from database import get_session
from typing import List, Optional
from auth import get_user

router = APIRouter()

@router.post("/users/", response_model=User, tags=['users'])
def create_user(body: CreateUser, session: Session = Depends(get_session)) -> User:
    hashed_password = pwd_context.hash(body.password)
    user = User(email=body.email, hashed_password=hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.get("/users/", response_model=List[User], tags=['users'])
def read_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users

@router.get("/users/{user_id}", response_model=Optional[User], tags=['users'])
def read_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    return user

def generate_unique_account_number(session: Session) -> str:
    while True:
        account_number = f"ACC{random.randint(100000, 999999)}"
        existing_account = session.exec(select(Account).where(Account.account_number == account_number)).first()
        if existing_account is None:
            return account_number

@router.post("/accounts/", response_model=Account, tags=['account'])
def create_account(body: CreateAccount, user: User = Depends(get_user), session: Session = Depends(get_session)) -> Account:
    account_number = generate_unique_account_number(session)

    account = Account(
        user_id=user.id,  
        balance=0,
        account_number=account_number,  # Unique account number
        isActive = True
    )
    session.add(account)
    session.commit()
    session.refresh(account)
    return account

@router.get("/accounts/", response_model=List[Account], tags=['account'])
def read_accounts(user: User = Depends(get_user), session: Session = Depends(get_session)):
    accounts = session.exec(select(Account).where(Account.user_id == user.id, Account.isActive == True)).all()
    return accounts


@router.get("/accounts/{account_number}", response_model=Optional[Account], tags=['account'])
def read_account(account_number: str, user: User = Depends(get_user), session: Session = Depends(get_session)):
    account = session.exec(select(Account).where(Account.account_number == account_number, Account.isActive == True, Account.user_id == user.id)).first()
    if account is None or account.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found or you do not have permission to access this account")
    return account


@router.post("/desactivate/{account_number}", tags=['account'])
def deactivate_account(account_number: str, user: User = Depends(get_user), session: Session = Depends(get_session)):
    account = session.exec(select(Account).where(Account.account_number == account_number, Account.isActive == True, Account.user_id == user.id)).first()
    mainAccount = session.exec(select(Account).where(Account.user_id == user.id and Account.isMain == True)).first()

    transactions = session.exec(select(Transaction).where((Transaction.sender_id == account_number) | (Transaction.receiver_id == account_number) , Transaction.status == 1)).all()

    if account.isMain == True:
        return "Impossible de désactiver votre compte principal"
    
    elif len(transactions) == 0:
        transaction = Transaction(
            sender_id=account_number,
            receiver_id=mainAccount.account_number,
            amount= account.balance,
            status=2
        )   
            
        mainAccount.balance += account.balance
        account.balance = 0

        account.isActive = False
        session.add(account)
        session.add(mainAccount)
        session.commit()
        return "compte desactivé avec succès"
        
    elif account is None:
        return "Compte introuvable"
    else:
        return "Des transactions sont en cours"


@router.post("/deposit/", response_model=Deposit, tags=['deposit'])
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

@router.get("/deposit/", response_model=List[Deposit], tags=['deposit'])
def read_deposit(user: User = Depends(get_user), session: Session = Depends(get_session)):
    # Find all accounts by user ID
    accounts = session.exec(select(Account).where(Account.user_id == user.id, Account.isActive == True)).all()
    account_numbers = [account.account_number for account in accounts]
    
    # Find all deposits for these accounts
    deposits = session.exec(select(Deposit).where(Deposit.account_number.in_(account_numbers))).all()
    return deposits