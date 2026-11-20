from fastapi import FastAPI, Depends
from app.routes.user import router as users_router
from app.config.settings import settings
from fastapi.middleware.cors import CORSMiddleware
from app.dependencies.auth import get_current_user
from app.routes.project import router as projects_router

app = FastAPI(title=settings.supabase_url)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",


]
# CORS confi
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Users router
app.include_router(users_router)
app.include_router(projects_router)


@app.get("/")
def home():
    return {"msg": "backend start"}

@app.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {
        "id": user["id"],
        "email": user.get("email"),
    }


@app.get("/ping")
def ping():
    return {
        "status": "success",
        "message": "Hello from FastAPI!",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }
    

@app.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {
        "id": user["id"],
        "email": user.get("email"),
    }