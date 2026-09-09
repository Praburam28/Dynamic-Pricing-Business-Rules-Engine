from decimal import Decimal

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.schemas.promotion import (
    PromotionCreate,
    PromotionListResponse,
    PromotionResponse,
    PromotionUpdate,
)
from app.services.promotion_service import PromotionService


router = APIRouter(
    prefix="/promotions",
    tags=["Promotions"],
)


@router.post(
    "",
    response_model=PromotionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_promotion(
    data: PromotionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PromotionService.create(
        db=db,
        data=data,
    )


@router.get(
    "",
    response_model=PromotionListResponse,
)
def get_promotions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    is_active: bool | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return PromotionService.get_all(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        is_active=is_active,
    )


@router.get(
    "/{promotion_id}",
    response_model=PromotionResponse,
)
def get_promotion(
    promotion_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return PromotionService.get(
        db=db,
        promotion_id=promotion_id,
    )


@router.patch(
    "/{promotion_id}",
    response_model=PromotionResponse,
)
def update_promotion(
    promotion_id: int,
    data: PromotionUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PromotionService.update(
        db=db,
        promotion_id=promotion_id,
        data=data,
    )


@router.patch(
    "/{promotion_id}/activate",
    response_model=PromotionResponse,
)
def activate_promotion(
    promotion_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PromotionService.activate(
        db=db,
        promotion_id=promotion_id,
    )


@router.patch(
    "/{promotion_id}/deactivate",
    response_model=PromotionResponse,
)
def deactivate_promotion(
    promotion_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PromotionService.deactivate(
        db=db,
        promotion_id=promotion_id,
    )


@router.post(
    "/validate/{code}",
    response_model=PromotionResponse,
)
def validate_promotion(
    code: str,
    purchase_amount: Decimal = Query(..., ge=0),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return PromotionService.validate_for_purchase(
        db=db,
        code=code,
        purchase_amount=purchase_amount,
    )
