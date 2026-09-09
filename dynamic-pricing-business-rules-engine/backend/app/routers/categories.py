from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin
from app.schemas.category import (
    CategoryCreate,
    CategoryListResponse,
    CategoryResponse,
    CategoryUpdate,
)
from app.services.category_service import CategoryService


router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return CategoryService.create(
        db=db,
        data=data,
    )


@router.get(
    "",
    response_model=CategoryListResponse,
)
def get_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    is_active: bool | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return CategoryService.get_all(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        is_active=is_active,
    )


@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return CategoryService.get(
        db=db,
        category_id=category_id,
    )


@router.patch(
    "/{category_id}",
    response_model=CategoryResponse,
)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return CategoryService.update(
        db=db,
        category_id=category_id,
        data=data,
    )


@router.patch(
    "/{category_id}/activate",
    response_model=CategoryResponse,
)
def activate_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return CategoryService.activate(
        db=db,
        category_id=category_id,
    )


@router.patch(
    "/{category_id}/deactivate",
    response_model=CategoryResponse,
)
def deactivate_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return CategoryService.deactivate(
        db=db,
        category_id=category_id,
    )
