from decimal import Decimal

from pydantic import BaseModel, Field


class RuleTestRequest(BaseModel):
    rule_id: int = Field(..., ge=1)
    customer_type: str | None = None
    customer_category: str | None = None
    location: str | None = None
    quantity: int = Field(..., ge=1)
    category_id: int = Field(..., ge=1)
    product_id: int = Field(..., ge=1)
    base_price: Decimal = Field(..., ge=0)


class RuleTestResponse(BaseModel):
    rule_id: int
    rule_name: str
    matched: bool
    execution_type: str
    message: str
    discount_amount: Decimal
