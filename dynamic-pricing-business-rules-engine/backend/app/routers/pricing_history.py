from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_user
from app.database import get_db
from app.schemas.pricing_history import (
    PricingHistoryListResponse,
    PricingHistoryResponse,
)
from app.services.pricing_history_service import (
    PricingHistoryService,
)

router = APIRouter(
    prefix="/pricing-history",
    tags=["Pricing History"],
)


@router.get(
    "",
    response_model=PricingHistoryListResponse,
)
def get_pricing_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    product_id: int | None = Query(None, ge=1),
    customer_id: int | None = Query(None, ge=1),
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    return PricingHistoryService.get_all(
        db=db,
        skip=skip,
        limit=limit,
        product_id=product_id,
        customer_id=customer_id,
    )


@router.get(
    "/{calculation_id}",
    response_model=PricingHistoryResponse,
)
def get_pricing_history_by_id(
    calculation_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    return PricingHistoryService.get_by_id(
        db=db,
        calculation_id=calculation_id,
    )
