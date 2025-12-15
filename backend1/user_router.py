# backend/user_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserDisplay, Token
from hashing import Hash
from jwt_handler import create_access_token
from typing import List

router = APIRouter(tags=['Authentication'])

@router.post('/signup', response_model=UserDisplay)
def signup(request: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Email already registered.")
    new_user = User(email=request.email, hashed_password=Hash.bcrypt(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post('/login', response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not Hash.verify(user.hashed_password, form_data.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/leaderboard", response_model=List[UserDisplay])
def get_leaderboard(db: Session = Depends(get_db)):
    """
    Retrieves the top 10 users with the highest scores.
    """
    # This is the SQLAlchemy query to get the leaderboard data.
    # It queries the User model, orders the results by the score column in descending order,
    # limits the results to 10, and gets all of them.
    top_users = db.query(User).order_by(User.score.desc()).limit(10).all()
    return top_users 