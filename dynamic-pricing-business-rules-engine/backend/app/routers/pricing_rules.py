from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.schemas.pricing_rule import (
    PricingRuleCreate,
    PricingRuleListResponse,
    PricingRuleResponse,
    PricingRuleUpdate,
)
from app.services.pricing_rule_service import PricingRuleService


router = APIRouter(
    prefix="/pricing-rules",
    tags=["Pricing Rules"],
)


@router.post(
    "",
    response_model=PricingRuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_pricing_rule(
    data: PricingRuleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PricingRuleService.create(
        db=db,
        data=data,
    )


@router.get(
    "",
    response_model=PricingRuleListResponse,
)
def get_pricing_rules(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    is_active: bool | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return PricingRuleService.get_all(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        is_active=is_active,
    )


@router.get(
    "/{rule_id}",
    response_model=PricingRuleResponse,
)
def get_pricing_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return PricingRuleService.get(
        db=db,
        rule_id=rule_id,
    )


@router.patch(
    "/{rule_id}",
    response_model=PricingRuleResponse,
)
def update_pricing_rule(
    rule_id: int,
    data: PricingRuleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PricingRuleService.update(
        db=db,
        rule_id=rule_id,
        data=data,
    )


@router.patch(
    "/{rule_id}/activate",
    response_model=PricingRuleResponse,
)
def activate_pricing_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PricingRuleService.activate(
        db=db,
        rule_id=rule_id,
    )


@router.patch(
    "/{rule_id}/deactivate",
    response_model=PricingRuleResponse,
)
def deactivate_pricing_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PricingRuleService.deactivate(
        db=db,
        rule_id=rule_id,
    )
