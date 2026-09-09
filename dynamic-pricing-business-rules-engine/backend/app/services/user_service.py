from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository


class UserService:

    @staticmethod
    def get_users(
        db: Session,
        skip: int = 0,
        limit: int = 20,
    ):
        if skip < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Skip cannot be negative",
            )

        if limit < 1 or limit > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Limit must be between 1 and 100",
            )

        users = UserRepository.get_all(
            db,
            skip=skip,
            limit=limit,
        )

        total = UserRepository.count(db)

        return {
            "items": users,
            "total": total,
            "skip": skip,
            "limit": limit,
        }

    @staticmethod
    def get_user(
        db: Session,
        user_id: int,
    ):
        user = UserRepository.get_by_id(db, user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return user

    @staticmethod
    def activate_user(
        db: Session,
        user_id: int,
    ):
        user = UserService.get_user(db, user_id)

        if user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already active",
            )

        return UserRepository.update_active_status(
            db,
            user,
            True,
        )

    @staticmethod
    def deactivate_user(
        db: Session,
        user_id: int,
    ):
        user = UserService.get_user(db, user_id)

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already inactive",
            )

        return UserRepository.update_active_status(
            db,
            user,
            False,
        )

    @staticmethod
    def update_role(
        db: Session,
        user_id: int,
        role_id: int,
    ):
        user = UserService.get_user(db, user_id)

        if role_id not in (1, 2):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role. Use 1 for admin or 2 for user.",
            )

        if user.role_id == role_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has this role",
            )

        return UserRepository.update_role(
            db,
            user,
            role_id,
        )
