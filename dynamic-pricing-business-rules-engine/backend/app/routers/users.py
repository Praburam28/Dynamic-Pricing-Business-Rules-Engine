from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.schemas.auth import (
    RoleUpdateRequest,
    UserListResponse,
    UserResponse,
)
from app.services.user_service import UserService


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_profile(
    current_user=Depends(get_current_user),
):
    return current_user


@router.get(
    "/admin-test",
    response_model=UserResponse,
)
def admin_test(
    current_user=Depends(require_admin),
):
    return current_user


@router.get(
    "",
    response_model=UserListResponse,
)
def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return UserService.get_users(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return UserService.get_user(
        db=db,
        user_id=user_id,
    )


@router.patch(
    "/{user_id}/activate",
    response_model=UserResponse,
)
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return UserService.activate_user(
        db=db,
        user_id=user_id,
    )


@router.patch(
    "/{user_id}/deactivate",
    response_model=UserResponse,
)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return UserService.deactivate_user(
        db=db,
        user_id=user_id,
    )


@router.patch(
    "/{user_id}/role",
    response_model=UserResponse,
)
def update_user_role(
    user_id: int,
    role_data: RoleUpdateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return UserService.update_role(
        db=db,
        user_id=user_id,
        role_id=role_data.role_id,
    )
