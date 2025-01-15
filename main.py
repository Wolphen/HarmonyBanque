from fastapi import FastAPI
from database import create_db_and_tables
from route.auth import router as auth_router
from route.deposit import router as deposit_router
from route.transactions import router as trans_router
from route.account import router as account_router
from route.users import router as users_router

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    
    

app.include_router(auth_router, prefix="/auth") 
app.include_router(deposit_router, prefix="/deposit")
app.include_router(trans_router, prefix="/transactions")
app.include_router(account_router, prefix="/accounts")
app.include_router(users_router, prefix="/users")