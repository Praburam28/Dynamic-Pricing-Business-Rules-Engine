from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    customer_type: str = Field(..., max_length=30)
    customer_category: str | None = Field(default=None, max_length=50)
    location: str | None = Field(default=None, max_length=255)
    account_status: str = Field(default="ACTIVE", max_length=30)


class CustomerUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=150)
    email: EmailStr | None = None
    customer_type: str | None = Field(default=None, max_length=30)
    customer_category: str | None = Field(default=None, max_length=50)
    location: str | None = Field(default=None, max_length=255)
    account_status: str | None = Field(default=None, max_length=30)


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    customer_type: str
    customer_category: str | None
    location: str | None
    account_status: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class CustomerListResponse(BaseModel):
    items: list[CustomerResponse]
    total: int
    skip: int
    limit: int
