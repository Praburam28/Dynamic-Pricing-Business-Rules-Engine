from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    customer_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    customer_category: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    location: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    account_status: Mapped[str] = mapped_column(
        String(30),
        default="ACTIVE",
        nullable=False,
        index=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    pricing_calculations = relationship(
        "PricingCalculation",
        back_populates="customer",
    )
