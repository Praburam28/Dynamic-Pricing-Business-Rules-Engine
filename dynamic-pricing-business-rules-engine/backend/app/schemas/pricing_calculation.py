from decimal import Decimal

from pydantic import BaseModel, Field


class PricingCalculationRequest(BaseModel):
    product_id: int = Field(..., ge=1)
    customer_id: int = Field(..., ge=1)
    quantity: int = Field(..., ge=1)
    location: str | None = None
    promotional_code: str | None = None
    tax_rate: Decimal = Field(default=Decimal("0.00"), ge=0, le=100)


class AppliedRuleResponse(BaseModel):
    rule_id: int
    rule_name: str
    discount_amount: Decimal


class PricingCalculationResponse(BaseModel):
    calculation_id: int | None
    product_id: int
    customer_id: int
    quantity: int
    base_price: Decimal
    original_price: Decimal
    discount_amount: Decimal
    promotion_discount: Decimal
    tax_rate: Decimal
    tax_amount: Decimal
    final_price: Decimal
    promotional_code: str | None
    applied_rules: list[AppliedRuleResponse]
