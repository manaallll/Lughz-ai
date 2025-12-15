# backend/riddle_router.py
import os
import openai
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas import RiddleRequest, Riddle, UserDisplay, AnswerSubmit
from models import User
from database import get_db
from jwt_handler import verify_token_and_get_email
from auth import oauth2_scheme
from typing import List # Import List from the standard typing module

router = APIRouter(
    prefix='/riddle', 
    tags=['Riddles']
)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    email = verify_token_and_get_email(token)
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

# The response model is now correctly defined as a List of Riddle schemas
@router.post('/', response_model=List[Riddle])
def generate_riddle(request: RiddleRequest, current_user: User = Depends(get_current_user)):
    
    category_guideline = ""
    category = request.category.lower()
    if category == 'math':
        category_guideline = "For 'Math' riddles, AVOID simple arithmetic. Focus on concepts like geometry, algebra, patterns, or famous theorems."
    elif category == 'science':
        category_guideline = "For 'Science' riddles, focus on concepts from physics, biology, or chemistry. Avoid simple definitions."

    prompt = f"""
    You are LughzAI, a master riddle-maker. Your task is to generate a JSON array containing exactly {request.count} unique and clever riddles for the category: "{request.category}".

    {category_guideline}

    Follow these rules strictly:
    1. Your entire output MUST be a single, valid JSON array.
    2. The array must contain exactly {request.count} JSON objects.
    3. Each object MUST have the keys "riddle", "options", and "correct_answer".
    4. Do not include any introductory text, explanations, or markdown like ```json. Your response MUST start with '[' and end with ']'.

    Example of the required output format for a request of 2 riddles:
    [
        {{
          "riddle": "Riddle 1 text...",
          "options": ["Option A", "B", "C", "D"],
          "correct_answer": "Correct answer for riddle 1."
        }},
        {{
          "riddle": "Riddle 2 text...",
          "options": ["..."],
          "correct_answer": "..."
        }}
    ]
    """

    temperature = 0.8 if category in ['math', 'science'] else 0.7

    try:
        if not openai.api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key is not configured.")
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature
        )
        json_response_str = response.choices[0].message.content
        return json.loads(json_response_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating riddles from AI: {str(e)}")


@router.post('/submit-answer', response_model=UserDisplay)
def submit_answer(request: AnswerSubmit, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if request.user_answer.strip().lower() == request.correct_answer.strip().lower():
        points_to_add = 5 if request.hint_used else 15
        current_user.score += points_to_add
        db.commit()
        db.refresh(current_user)
    return current_user