import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from models import User, Account, Deposit, Transaction
from schemas import CreateUser, CreateAccount, CreateDeposit
from database import get_session
from typing import List, Optional
from route.auth import get_user

router = APIRouter()

def generate_unique_account_number(session: Session) -> str:
    while True:
        account_number = f"FR76 30044 00001 {random.randint(10000000000, 99999999999)} {random.randint(10, 99)}"
        existing_account = session.exec(select(Account).where(Account.account_number == account_number)).first()
        if existing_account is None:
            return account_number

@router.post("/", response_model=Account, tags=['account'])
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

@router.get("/", response_model=List[Account], tags=['account'])
def read_accounts(user: User = Depends(get_user), session: Session = Depends(get_session)):
    accounts = session.exec(select(Account).where(Account.user_id == user.id, Account.isActive == True)).all()
    return accounts


@router.get("/{account_number}", response_model=Optional[Account], tags=['account'])
def read_account(account_number: str, user: User = Depends(get_user), session: Session = Depends(get_session)):
    account = session.exec(select(Account).where(Account.account_number == account_number, Account.isActive == True, Account.user_id == user.id)).first()
    if account is None or account.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found or you do not have permission to access this account")
    return account


@router.post("/{account_number}/desactivate", tags=['account'])
def deactivate_account(account_number: str, user: User = Depends(get_user), session: Session = Depends(get_session)):
    account = session.exec(select(Account).where(Account.account_number == account_number, Account.isActive == True, Account.user_id == user.id)).first()
    mainAccount = session.exec(select(Account).where(Account.user_id == user.id and Account.isMain == True)).first()

    transactions = session.exec(select(Transaction).where((Transaction.sender_id == account_number) | (Transaction.receiver_id == account_number) , Transaction.status == 1)).all()

    if account.isMain == True:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Impossible de desactiver votre compte principal")
    
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compte desactivé avec succès")
        
    elif account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compte introuvable")
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Des transaction sont en cours")

@router.get("/{account_number}/transactions", response_model=List[Transaction], tags=['account'])
def read_transactions(account_number : str, session: Session = Depends(get_session), user: User = Depends(get_user)):
    account = session.exec(select(Account).where(Account.account_number == account_number)).first()
    accountOwner = account.user_id
    if accountOwner != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ce compte ne vous appartient pas")
    transactions = session.exec(select(Transaction).where((Transaction.sender_id == account_number) | (Transaction.receiver_id == account_number))).all()
    if transactions is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aucune transactions")
    return transactions