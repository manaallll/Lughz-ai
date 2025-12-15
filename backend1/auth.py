# backend/auth.py
from fastapi.security import OAuth2PasswordBearer

# This is the single source of truth for our authentication scheme.
# Both login and protected routes will refer to this.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")