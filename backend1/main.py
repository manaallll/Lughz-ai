# backend/main.py
import os
from fastapi import FastAPI
# --- ADD THIS IMPORT ---
from fastapi.middleware.cors import CORSMiddleware
import openai
from dotenv import load_dotenv
from database import engine, Base
import models
from user_router import router as user_router
from riddle_router import router as riddle_router

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LughzAI Backend")

# --- THIS IS THE CRITICAL FIX ---
# We are telling the backend to allow requests from ANY origin.
# This is safe for development. For a real production website, you would
# list your specific frontend URL, e.g., ["https://www.lughzai.com"].
origins = [
    "http://localhost:5174",]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (POST, GET, etc.)
    allow_headers=["*"], # Allow all headers
)
# --- END OF FIX ---

app.include_router(user_router)
app.include_router(riddle_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the LughzAI API!"}