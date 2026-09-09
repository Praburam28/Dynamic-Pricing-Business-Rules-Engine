from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    UserRegister,
    UserResponse,
)
from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db),
):
    return AuthService.register(
        db=db,
        user_data=user_data,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):
    return AuthService.login(
        db=db,
        username=login_data.username,
        password=login_data.password,
    )
