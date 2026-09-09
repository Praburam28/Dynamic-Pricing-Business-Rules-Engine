from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class PricingHistoryRuleResponse(BaseModel):
    rule_id: int
    rule_name: str
    action_type: str
    discount_amount: Decimal

    model_config = ConfigDict(from_attributes=True)


class PricingHistoryResponse(BaseModel):
    calculation_id: int
    product_id: int
    customer_id: int
    quantity: int
    location: str | None
    promotional_code: str | None
    original_price: Decimal
    discount_amount: Decimal
    tax_amount: Decimal
    final_price: Decimal
    calculated_at: datetime
    applied_rules: list[PricingHistoryRuleResponse] = []


class PricingHistoryListResponse(BaseModel):
    items: list[PricingHistoryResponse]
    total: int
    skip: int
    limit: int
