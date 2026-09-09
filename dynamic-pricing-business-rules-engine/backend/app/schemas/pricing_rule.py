from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class RuleConditionCreate(BaseModel):
    field: str = Field(..., min_length=1, max_length=100)
    operator: str = Field(..., min_length=1, max_length=30)
    value: str = Field(..., min_length=1, max_length=255)
    condition_group: int = Field(default=1, ge=1)
    logical_operator: str = Field(default="AND", max_length=10)


class RuleActionCreate(BaseModel):
    action_type: str = Field(..., min_length=1, max_length=50)
    discount_type: str | None = Field(default=None, max_length=30)
    value: Decimal = Field(..., ge=0, decimal_places=2)


class PricingRuleCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    description: str | None = Field(default=None, max_length=1000)
    priority: int = Field(default=100, ge=1)
    execution_type: str = Field(default="COMBINABLE", max_length=30)
    maximum_discount: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    start_date: datetime | None = None
    end_date: datetime | None = None
    is_active: bool = True

    conditions: list[RuleConditionCreate] = Field(..., min_length=1)
    actions: list[RuleActionCreate] = Field(..., min_length=1)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date:
            if self.end_date <= self.start_date:
                raise ValueError("end_date must be after start_date")
        return self


class PricingRuleUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=150)
    description: str | None = Field(default=None, max_length=1000)
    priority: int | None = Field(default=None, ge=1)
    execution_type: str | None = Field(default=None, max_length=30)
    maximum_discount: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    start_date: datetime | None = None
    end_date: datetime | None = None
    is_active: bool | None = None


class RuleConditionResponse(BaseModel):
    id: int
    rule_id: int
    field: str
    operator: str
    value: str
    condition_group: int
    logical_operator: str

    model_config = ConfigDict(from_attributes=True)


class RuleActionResponse(BaseModel):
    id: int
    rule_id: int
    action_type: str
    discount_type: str | None
    value: Decimal

    model_config = ConfigDict(from_attributes=True)


class PricingRuleResponse(BaseModel):
    id: int
    name: str
    description: str | None
    priority: int
    execution_type: str
    maximum_discount: Decimal | None
    start_date: datetime | None
    end_date: datetime | None
    is_active: bool
    conditions: list[RuleConditionResponse]
    actions: list[RuleActionResponse]

    model_config = ConfigDict(from_attributes=True)


class PricingRuleListResponse(BaseModel):
    items: list[PricingRuleResponse]
    total: int
    skip: int
    limit: int
