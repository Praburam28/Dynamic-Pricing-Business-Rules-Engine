from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    sku: str = Field(..., min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=1000)
    base_price: Decimal = Field(..., ge=0, decimal_places=2)
    category_id: int = Field(..., ge=1)


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=150)
    sku: str | None = Field(default=None, min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=1000)
    base_price: Decimal | None = Field(default=None, ge=0, decimal_places=2)
    category_id: int | None = Field(default=None, ge=1)


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    description: str | None
    base_price: Decimal
    category_id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    skip: int
    limit: int
    sort_by: str
    sort_order: str
