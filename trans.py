import asyncio
from asyncio import sleep
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from database import get_session
from models import Account, Transaction, User
from schemas import CreateTransaction
from auth import get_user

router = APIRouter()

async def process_transaction(transaction_id: int, session: Session):
    await sleep(10)
    with session:
        transaction = session.get(Transaction, transaction_id)
        if transaction and transaction.status == 1:
            # Update the transaction status to 2 (completed)
            transaction.status = 2
            session.add(transaction)
            
            # Credit the receiver's account
            receiver_account = session.exec(select(Account).where(Account.account_number == transaction.receiver_id)).first()
            if receiver_account:
                receiver_account.balance += transaction.amount
                session.add(receiver_account)
            
            session.commit()

@router.post("/transactions/", response_model=Transaction)
async def create_transaction(body: CreateTransaction, user: User = Depends(get_user), session: Session = Depends(get_session)) -> Transaction:
    sender_account = session.exec(select(Account).where(Account.user_id == user.id, Account.account_number == body.sender_id)).first()
    if sender_account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    
    if sender_account.balance < body.amount:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough money")

    if body.amount < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Amount must be positive and more than 1")

    receiver_account = session.exec(select(Account).where(Account.account_number == body.receiver_id)).first()
    if receiver_account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receiver account not found")

    # Decrement the sender's account balance
    sender_account.balance -= body.amount
    session.add(sender_account)

    transaction = Transaction(
        sender_id=body.sender_id,
        receiver_id=body.receiver_id,
        amount=body.amount,
        status=1  # Transaction in progress
    )
    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    # Start the async task to process the transaction after 10 seconds
    asyncio.create_task(process_transaction(transaction.id, session))

    return transaction

@router.post("/transactions/cancel/{transaction_id}", response_model=Transaction)
def cancel_transaction(transaction_id: int, user: User = Depends(get_user), session: Session = Depends(get_session)) -> Transaction:
    transaction = session.get(Transaction, transaction_id)
    if transaction is None or transaction.status != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found or cannot be canceled")

    sender_account = session.exec(select(Account).where(Account.account_number == transaction.sender_id)).first()
    if sender_account is None or sender_account.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to cancel this transaction")

    # Refund the sender's account balance
    sender_account.balance += transaction.amount
    session.add(sender_account)

    # Update the transaction status to 0 (canceled)
    transaction.status = 0
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return transaction

@router.get("/transactions/", response_model=List[Transaction])
def read_transactions(user: User = Depends(get_user), session: Session = Depends(get_session)):
    transactions = session.exec(select(Transaction).where(
        (Transaction.sender_id == user.id) | (Transaction.receiver_id == user.id)
    )).all()
    return transactions

@router.delete("/transactions/{transaction_id}", response_model=Transaction)
def delete_transaction(transaction_id: int, user: User = Depends(get_user), session: Session = Depends(get_session)) -> Transaction:
    transaction = session.get(Transaction, transaction_id)
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    sender_account = session.exec(select(Account).where(Account.account_number == transaction.sender_id)).first()
    if sender_account is None or sender_account.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this transaction")

    session.delete(transaction)
    session.commit()
    return transaction