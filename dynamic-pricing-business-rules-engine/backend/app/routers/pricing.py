from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.pricing_calculation import (
    PricingCalculationRequest,
    PricingCalculationResponse,
)
from app.services.pricing_service import PricingService


router = APIRouter(
    prefix="/pricing",
    tags=["Pricing"],
)


@router.post(
    "/calculate",
    response_model=PricingCalculationResponse,
)
def calculate_price(
    data: PricingCalculationRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return PricingService.calculate(
        db=db,
        data=data,
    )
