from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.schemas.customer import (
    CustomerCreate,
    CustomerListResponse,
    CustomerResponse,
    CustomerUpdate,
)
from app.services.customer_service import CustomerService


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.post(
    "",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_customer(
    data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return CustomerService.create(db, data)


@router.get(
    "",
    response_model=CustomerListResponse,
)
def get_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return CustomerService.get_all(
        db,
        skip,
        limit,
    )


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return CustomerService.get(
        db,
        customer_id,
    )


@router.patch(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def update_customer(
    customer_id: int,
    data: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return CustomerService.update(
        db,
        customer_id,
        data,
    )


@router.patch(
    "/{customer_id}/activate",
    response_model=CustomerResponse,
)
def activate_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return CustomerService.activate(
        db,
        customer_id,
    )


@router.patch(
    "/{customer_id}/deactivate",
    response_model=CustomerResponse,
)
def deactivate_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return CustomerService.deactivate(
        db,
        customer_id,
    )
