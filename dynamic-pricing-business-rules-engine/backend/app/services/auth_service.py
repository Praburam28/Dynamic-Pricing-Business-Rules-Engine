from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserRegister


class AuthService:

    @staticmethod
    def register(
        db: Session,
        user_data: UserRegister,
    ):
        existing_username = UserRepository.get_by_username(
            db,
            user_data.username,
        )

        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already exists",
            )

        existing_email = UserRepository.get_by_email(
            db,
            user_data.email,
        )

        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already exists",
            )

        password_hash = hash_password(user_data.password)

        user = UserRepository.create(
            db=db,
            username=user_data.username,
            email=user_data.email,
            password_hash=password_hash,
            role_id=2,
        )

        return user

    @staticmethod
    def login(
        db: Session,
        username: str,
        password: str,
    ):
        user = UserRepository.get_by_username(
            db,
            username,
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )

        if not verify_password(
            password,
            user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        token = create_access_token(
            {
                "sub": str(user.id),
                "username": user.username,
                "role_id": user.role_id,
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }
