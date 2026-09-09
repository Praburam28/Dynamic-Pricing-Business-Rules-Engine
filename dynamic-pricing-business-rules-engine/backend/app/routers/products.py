from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.schemas.product import (
    ProductCreate,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
)
from app.services.product_service import ProductService


router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return ProductService.create(
        db=db,
        data=data,
    )


@router.get(
    "",
    response_model=ProductListResponse,
)
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    category_id: int | None = Query(None, ge=1),
    is_active: bool | None = Query(None),
    sort_by: str = Query("id"),
    sort_order: str = Query("asc"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return ProductService.get_all(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        category_id=category_id,
        is_active=is_active,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return ProductService.get(
        db=db,
        product_id=product_id,
    )


@router.patch(
    "/{product_id}",
    response_model=ProductResponse,
)
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return ProductService.update(
        db=db,
        product_id=product_id,
        data=data,
    )


@router.patch(
    "/{product_id}/activate",
    response_model=ProductResponse,
)
def activate_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return ProductService.activate(
        db=db,
        product_id=product_id,
    )


@router.patch(
    "/{product_id}/deactivate",
    response_model=ProductResponse,
)
def deactivate_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return ProductService.deactivate(
        db=db,
        product_id=product_id,
    )
