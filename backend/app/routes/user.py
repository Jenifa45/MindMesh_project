
from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/users")
def get_users():
    return {"message": "Users API"}


@router.get("/me")
def get_current_user_route(user: dict = Depends(get_current_user)):
    return {
        "message": "JWT verified successfully",
        "user_id": user["id"],
        "email": user.get("email"),
    }
