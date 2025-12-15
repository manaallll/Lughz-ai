# backend/schemas.py
from pydantic import BaseModel
from typing import List, Optional

# --- User Schemas ---
class UserCreate(BaseModel):
    email: str
    password: str

class UserDisplay(BaseModel):
    email: str
    score: int

    class Config:
        from_attributes = True

# --- Token Schema ---
class Token(BaseModel):
    access_token: str
    token_type: str

# --- Riddle Schemas ---
class RiddleRequest(BaseModel):
    category: str
    count: int = 1 # Add this line. It defaults to 1 so our old tests don't break.
    previous_riddles: Optional[List[str]] = None
class Riddle(BaseModel):
    riddle: str
    options: List[str]
    correct_answer: str

# --- Answer Submission Schema ---
# This class should NOT be indented. It is its own separate schema.
class AnswerSubmit(BaseModel):
    riddle: str
    correct_answer: str
    user_answer: str
    hint_used: bool


    