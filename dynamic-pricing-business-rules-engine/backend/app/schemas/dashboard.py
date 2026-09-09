from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    total_calculations: int
    total_original_value: Decimal
    total_discount: Decimal
    total_tax: Decimal
    total_final_value: Decimal
    active_products: int
    active_customers: int
    active_pricing_rules: int


class RecentCalculationResponse(BaseModel):
    calculation_id: int
    product_id: int
    customer_id: int
    quantity: int
    original_price: Decimal
    discount_amount: Decimal
    tax_amount: Decimal
    final_price: Decimal
    calculated_at: datetime


class RuleUsageResponse(BaseModel):
    rule_id: int
    rule_name: str
    usage_count: int


class DashboardAnalyticsResponse(BaseModel):
    summary: DashboardSummaryResponse
    recent_calculations: list[RecentCalculationResponse]
    rule_usage: list[RuleUsageResponse]
