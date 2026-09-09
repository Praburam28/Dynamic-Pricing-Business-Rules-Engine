from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class PromotionCreate(BaseModel):
    code: str = Field(..., min_length=2, max_length=50)
    discount_type: str = Field(..., max_length=30)
    discount_value: Decimal = Field(..., ge=0, decimal_places=2)
    minimum_purchase: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    maximum_discount: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    start_date: datetime
    expiry_date: datetime
    usage_limit: int | None = Field(default=None, ge=1)
    is_active: bool = True

    @model_validator(mode="after")
    def validate_promotion(self):
        if self.expiry_date <= self.start_date:
            raise ValueError("expiry_date must be after start_date")

        if self.discount_type not in {"PERCENTAGE", "FIXED"}:
            raise ValueError(
                "discount_type must be PERCENTAGE or FIXED"
            )

        if (
            self.discount_type == "PERCENTAGE"
            and self.discount_value > 100
        ):
            raise ValueError(
                "Percentage discount cannot exceed 100"
            )

        return self


class PromotionUpdate(BaseModel):
    discount_type: str | None = Field(default=None, max_length=30)
    discount_value: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    minimum_purchase: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    maximum_discount: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    start_date: datetime | None = None
    expiry_date: datetime | None = None
    usage_limit: int | None = Field(default=None, ge=1)
    is_active: bool | None = None


class PromotionResponse(BaseModel):
    id: int
    code: str
    discount_type: str
    discount_value: Decimal
    minimum_purchase: Decimal | None
    maximum_discount: Decimal | None
    start_date: datetime
    expiry_date: datetime
    usage_limit: int | None
    usage_count: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class PromotionListResponse(BaseModel):
    items: list[PromotionResponse]
    total: int
    skip: int
    limit: int
