from fastapi import FastAPI
from database import create_db_and_tables
from auth import router as auth_router
from crud import router as crud_router
from trans import router as trans_router

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    
    

app.include_router(auth_router, prefix="/auth")
app.include_router(crud_router, prefix="/crud")
app.include_router(trans_router, prefix="/trans")